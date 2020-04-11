import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable } from 'apollo-link';
import AsyncStorage from '@react-native-community/async-storage';
import { setContext } from 'apollo-link-context';
import { RetryLink } from "apollo-link-retry";

//navigation
import { navigation_set_root_one_screen } from "./../navigation/navigation_routes/index"
import { LOGIN_SCREEN } from "./../navigation/screens"
 
// cached storage for the user token
let token = null

const get_jwt_asyncstorage = async() => {
  try{
    const jwt = await AsyncStorage.getItem("token")
    if (jwt){
      return jwt
    }
    return ""
  }catch(e){
    console.log("AsyncStorage Error(jwt token not setup): "+e)
    return ""
  }
}



const with_token = setContext(async() => {
  // if you have a cached value, return it immediately
  if(!token){
    token = await get_jwt_asyncstorage()
    }

  return {
    headers: {
      authorization: token,
    },
  }

})

//for resetting token to null after logout 
export const reset_token = () => {
  token = null
}

export const cache = new InMemoryCache({
  dataIdFromObject: object => object._id || null,
  cacheRedirects:{
    Query:{
      post_detailed_screen:(parent, args, {getCacheKey})=>{
        return getCacheKey({__typename:"Room_post_feed", _id:args._id})
      }
    }
  }
})

const logout_unauthenticated_err = async() => {
  //clearing token key from async storage
  await AsyncStorage.removeItem("token")
            
  //clearing apollo client cached data
  if(client){
    await client.clearStore()
  }

  reset_token()

  //navigate to login screen
  navigation_set_root_one_screen({
    screen_name:LOGIN_SCREEN
  })

}

const error_link = onError(({ graphQLErrors, networkError }) => {
    
    if (graphQLErrors){
      graphQLErrors.forEach(({message, locations, path, extensions})=> {
            if(extensions.code==="UNAUTHENTICATED"){
              logout_unauthenticated_err()
            }
            console.log(`[GraphQL error]: Message ${message}, Location: ${locations}, Path: ${path}, Extensions: code:${extensions.code}`)
        });
    }
    if (networkError){                
        console.log(`[Network error]: ${networkError}`);
    }
})



const retry_link = new RetryLink({
  attempts: (count, operation, error) => {

    //queries & mutations to avoid
    const avoid_requests_name = ['create_room_posts', 
                                  "register_users", 
                                  "edit_user_profiles", 
                                  "login_users", 
                                  "check_room_names",
                                  "create_rooms", 
                                  "password_recovery_send_codes",
                                  "password_recovery_code_verifications",
                                  "get_presigned_url",
                                  "check_usernames"                                                       
                                ]

    //making sure create_posts mutation isn't retried
    return !!error && !(avoid_requests_name.includes(operation.operationName));
  },
  delay: (count, operation, error) => {
    return count * 1000 * Math.random();
  },
});

const logger_link = new ApolloLink((operation, forward) => {
  console.log(`GraphQL Request: ${operation.operationName}`);
  operation.setContext({ start: new Date() });
  return forward(operation).map((response) => {
    const responseTime = new Date() - operation.getContext().start;
    console.log(`GraphQL Response took: ${responseTime}`);
    return response;
  });
});

const client = new ApolloClient({
  link: ApolloLink.from([
      logger_link,
      with_token,
      retry_link,
      error_link,
      new HttpLink({
          uri: "http://192.168.43.53:3000/graphql",
          credentials: "same-origin"
      })
  ]),
  cache:cache
});

export default client
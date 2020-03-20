import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable } from 'apollo-link';
import AsyncStorage from '@react-native-community/async-storage';

const get_jwt_asyncstorage = async() => {
  try{
    const jwt = await AsyncStorage.getItem("token")
    if (jwt){
      console.log(jwt, "daw")
      return jwt
    }
    return ""
  }catch(e){
    console.log("AsyncStorage Error(jwt token not setup): "+e)
    return ""
  }
}

const get_user_info_asyncstorage = async() => {
  try{
    const user_info_string = await AsyncStorage.getItem("user_info")
    if (user_info_string){
      return JSON.parse(user_info_string)
    }
    return {}
  }catch(e){
    console.log("AsyncStorage Error(user_info not setup): "+e)
    return {}
  }
}

const request = async (operation) => {
    // const token = await AsyncStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: await get_jwt_asyncstorage()
      }
    });
};

const requestLink = new ApolloLink((operation, forward) =>
  new Observable(observer => {
    let handle;
    Promise.resolve(operation)
      .then(oper => request(oper))
      .then(() => {
        handle = forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        });
      })
      .catch(observer.error.bind(observer));

    return () => {
      if (handle) handle.unsubscribe();
    };
  })
)

const cache = new InMemoryCache()

const load_cache_with_user = async(cache) => {
  const user_info_obj = await get_user_info_asyncstorage()
  console.log(user_info_obj)

  cache.writeData({
    data:{
      user_info:user_info_obj
    }
  })
}

load_cache_with_user(cache)

const client = new ApolloClient({
    link: ApolloLink.from([
        onError(({graphql_errors, network_error}) => {
            if (graphql_errors){
                graphql_errors.forEach(({message, locations, path})=> {
                    console.log(`[GraphQL error]: Message ${message}, Location: ${locations}, Path: ${path}`)
                });
            }
            if (network_error){
                console.log(`[Network error]: ${network_error}`);
            }
        }),
        requestLink,
        new HttpLink({
            uri: "http://localhost:3000/graphql",
            credentials: "same-origin"
        })
    ]),
    cache:cache
});

export default client
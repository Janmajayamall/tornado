import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';


const request = async (operation) => {
    const token = await AsyncStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: token
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
    cache: new InMemoryCache()
});

export default client
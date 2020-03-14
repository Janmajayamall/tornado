import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable } from 'apollo-link';


const request = async (operation) => {
    // const token = await AsyncStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTY2NDQ4NTRiMmE1OTRkNWMyZjNjMWQiLCJpYXQiOjE1ODQwMDM0NjY5NzMsImV4cCI6MTU4NDAwNDMzMDk3M30.VJFB18hc_FyxpxUgIPXxUff1hMCbTULwGcpjBeS7cU2OypSeN8RdRlqcMPlFjWq-s-6hBmmUIMKd4i9kKzoA0qYmvXqfjBWvJfpfUcqMfeYSsHe_mk-8JU3Q9N3Bhz2U9ALJzXkdzFzogDsRLt6WYGJ32pnxvjxzmAExnICglqYpU4IpUMuED7kjaCW7wFNj6d9eAeAcXS7-o-P6z0ZpQcMMfF8q0DUIcTh0qPZTi5OUILBJbNJGVCYgkwA631dlPibjsN47j7kGcdTOJ2Akac4608bSDWFp9X_URrOFUj08GAgOjwjYypCtlRnNvk_jcvCG6F6Fu1MzwdHqcw0d6tIWqiUZlE2k--o93a47H1itI-9iKPb3IADdB3RpNyrPQDsChUe-8D_jH7ldBLIwSRckSF4ct1erAzStzz14y8_ixzcuQ4K2qw3Nml3C8g1SNnmxAv1hXw0Fi3UNihPlYuygxMAGWOrrBH0RKui2-NViryMC6qQSGqCKioWhwJ4lFDpSHzHdokSmjP7eGS_QIhrf23auRQ0h5XYx9ururD3zkmUKlocjtKL1MgoA_PjWguT6Wno7kd5YOiB_6hoJWwpPbQqV00WzAzHWj_3CDKqnNID3QuwnxZ7pqwq25efF_prdup39eATKkXDfZ2xlcQmS2vEYZkAULk7BdwrIaUI"
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
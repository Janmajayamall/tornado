import React from 'react'
import {ApolloProvider} from '@apollo/react-hooks';
import {Provider} from 'react-redux'


export default function enhance_provider_hoc(ChildComponent, apollo_client, redux_store){

    class EnhanceProvider extends React.Component {
        
        render(){
            return(
                <Provider store={redux_store}>
                    <ApolloProvider client={apollo_client}>
                        <ChildComponent {...this.props}/>
                    </ApolloProvider>
                </Provider>
            )
        }   
    }

    return EnhanceProvider

}
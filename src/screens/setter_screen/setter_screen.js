import React from "react"
import { 
    View,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView
} from "react-native";
import {
    Mutation,
    Query
} from "react-apollo"
import {Navigation} from "react-native-navigation"

//importing base style 
import base_style from "../../styles/base"

//importing graphql queries
import {REGISTER_USER} from "./queries/index"
import base from "../../styles/base";

//import Queries/mutation graphql
import {
    GET_LOCAL_USER_INFO
} from "./queries/index"

// importing screens
import {
    LOGIN_SCREEN,
    FEED_SCREEN
} from "../../navigation/screens"



class Setter extends React.PureComponent{

    constructor(props){
        super(props)

        this.state = {
        }
    }

    componentDidMount(){
    }

    navigate_to_screen = (data) => {
      if (data.user_info && data.user_info.jwt && data.user_info.user_id){

          Navigation.setRoot({
              root: {
                stack: {
                  children: [{
                    component: {
                      name: FEED_SCREEN,
                      options: {
                        topBar: {
                          visible: false,
                        },
                      }
                    }
                  }]
                }
              }
            });

      }else{
          Navigation.setRoot({
              root: {
                stack: {
                  children: [{
                    component: {
                      name: LOGIN_SCREEN,
                      options: {
                        topBar: {
                          visible: false,
                        },
                      }
                    }
                  }]
                }
              }
            });
      }
    }

    render(){
        return(
            <Query query={GET_LOCAL_USER_INFO}>
                {({loading, error, data})=>{

                    if (loading){ //somehow loading is undefined in queries to cached data
                        return(
                            <View
                                style={styles.main_container}
                            />
                        )
                    }
                
                    if (data){
                        console.log(data, "dw")
                        this.navigate_to_screen(data)
                    }

                    return(
                        <View
                            style={styles.main_container}
                        />
                    )
                }}
            </Query>
        )
    }
}

const styles = {
    main_container:{
        backgroundColor:base_style.color.primary_color,
        flex:1
    },
}

export default Setter
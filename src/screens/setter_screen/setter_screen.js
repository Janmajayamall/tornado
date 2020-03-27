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
    FEED_SCREEN,
    EXPLORE_ROOMS_SCREEN,
    PROFILE_SCREEN,
    EDIT_PROFILE_SCREEN,
    REGISTER_SCREEN
} from "../../navigation/screens"
import {
  navigation_push_to_screen,
  navigation_set_root_two_bottoms_tabs,
  navigation_set_root_one_screen
} from "./../../navigation/navigation_routes/index"



class Setter extends React.PureComponent{

    constructor(props){
        super(props)

        this.state = {
        }
    }

    componentDidMount(){
    }

    navigate_to_screen = (data) => {
        
        if (data && data.user_info && data.user_info.jwt && data.user_info.user_id){
            console.log(data, "kjj")
            navigation_set_root_two_bottoms_tabs(
                {
                    screen_name:FEED_SCREEN,  
                    display_text:"FEED"
                }, 
                { 
                    screen_name:EXPLORE_ROOMS_SCREEN,  
                    display_text:"EXPLORE"
                },
                {
                    screen_name:PROFILE_SCREEN,  
                    display_text:"Profile",
                    props:{
                    is_user_profile:true
                    }
                }
            )

        }else{
            navigation_set_root_one_screen({screen_name:REGISTER_SCREEN})
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
                
                    if (!loading){
                        this.navigate_to_screen(data)
                    }

                    return(
                        <View></View>
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
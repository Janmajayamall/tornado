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
import AsyncStorage from "@react-native-community/async-storage"

//importing base style 
import base_style from "../../styles/base"

//importing graphql queries
import base from "../../styles/base";

//import Queries/mutation graphql
import {
    GET_USER_INFO
} from "./../../apollo_client/apollo_queries/index"

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

        this.check_user_jwt()
    }

    componentDidMount(){
    }

    check_user_jwt = async() => {
        try{
            const jwt = await AsyncStorage.getItem("token")
            console.log(jwt, "this is here")
            if (jwt){
                this.route_to_feed()
                return
            }
            this.route_to_login()
        }catch(e){
            this.route_to_login()    
        }
    }

    route_to_feed = () => {
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
                is_user:true
                }
            }
        )
    }
    
    route_to_login = () => {
        //routing the user to login
        navigation_set_root_one_screen({screen_name:FEED_SCREEN}) //change this to REGISTER_SCREEN
    }

    render(){
        return(
            <View
                style={styles.main_container}
            />
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
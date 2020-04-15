import React from "react"
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native"
import base_style from "./../../styles/base"
import AsyncStorage from "@react-native-community/async-storage"
import { withApollo } from "react-apollo"
import {Navigation} from "react-native-navigation"

//custom components 
import ListItemDivider from "./../../custom_components/common_decorators/list_item_divider"
import Loader from "./../../custom_components/loading/loading_component"

//navigation & screens
import {
    navigation_set_root_one_screen
} from "./../../navigation/navigation_routes/index"
import {
    SETTINGS_SCREEN, 
    LOGIN_SCREEN
} from "./../../navigation/screens"

import {
    constants
} from "./../../helpers/index"

//resetting apollo client 
import {reset_token} from "./../../apollo_client/client_configuration"

class SettingsScreen extends React.Component {

    constructor(props){
        super(props)
        
        this.state={
            loading:false
        }
    }

    componentDidMount(){
        //binding the topBar add post button 
        this.navigation_event_listener = Navigation.events().bindComponent(this);
    }

    //for topBar buttons
    navigationButtonPressed({ buttonId }) {        
        if(buttonId === constants.navigation.action_buttons.BACK){
            Navigation.pop(this.props.componentId)
        }
    }

    componentWillUnmount(){
        this.navigation_event_listener.remove()
    }

    logout = async () => {

        try{
            //if loading is true then return 
            if(this.state.loading){
                return 
            }

            //set loading to true
            this.setState({loading:true})
        
            //clearing token key from async storage
            await AsyncStorage.removeItem("token")
            
            //clearing apollo client cached data
            await this.props.client.clearStore()

            //resetting cached token in apollo client
            reset_token()

            //navigate to login screen
            navigation_set_root_one_screen({
                screen_name:LOGIN_SCREEN
            })

            return 
        }catch(e){           
            //TODO: inform user
            this.setState({loading:false})
        }
        return
    }


    render(){

        if(this.state.loading){
            return(
                <View style={styles.main_container}>
                    <Loader/>
                </View>
            )
        }

        return(
            <View style={styles.main_container}>
                <TouchableOpacity 
                    style={styles.item_row}
                    onPress={this.logout}
                >
                    <Text 
                        style={styles.item_text}                        
                    >
                        Logout
                    </Text>
                </TouchableOpacity>
                <ListItemDivider/>
            </View> 

        )
    }

}

const styles = StyleSheet.create({
    main_container:{
        backgroundColor:base_style.color.primary_color,
        flex:1
    },
    item_row:{
        padding:20
    },
    item_text:{
        ...base_style.typography.medium_font
    }
})

export default withApollo(SettingsScreen)
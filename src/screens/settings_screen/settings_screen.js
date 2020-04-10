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

class SettingsScreen extends React.Component {

    constructor(props){
        super(props)
        
        this.state={
            loading:false
        }
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

            //navigate to login screen
            navigation_set_root_one_screen({
                screen_name:LOGIN_SCREEN
            })

            return 
        }catch(e){
            console.log(e, "settings_screen.js | logout")
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
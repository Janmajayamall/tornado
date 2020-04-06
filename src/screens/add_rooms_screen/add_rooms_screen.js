import React from "react"
import { 
    StyleSheet,
    SafeAreaView,
    FlatList, 
    Text,
    TextInput,
    View,
    ScrollView,
    Dimensions
} from "react-native";
import PropTypes from "prop-types"
import { 
    Query, 
    ApolloConsumer, 
    Mutation, 
    withApollo
} from "react-apollo";
import { Navigation } from "react-native-navigation"

import base_style from "./../../styles/base"

//import graphql queries/mutations
import {
    GET_ALL_JOINED_ROOMS,
    CREATE_ROOM,
    GET_USER_INFO
} from "./../../apollo_client/apollo_queries/index"

//importing custom components 
import ApolloClient from "apollo-client";

//importing helpers
import {
    constants
} from "./../../helpers/index"

const window = Dimensions.get("window")

class AddRooms extends React.Component{

    static propTypes = {
        add_room_to_set:PropTypes.func,
        remove_room_from_set:PropTypes.func,
        rooms_id_set:PropTypes.any, 
    }

    constructor(props){
        super(props)
        this.state = {
            name:"",
            description:"",
            loading:false
        }

        //binding the topBar add post button 
        Navigation.events().bindComponent(this);
    }

    //react native navigation event binded function for action buttons
    navigationButtonPressed({ buttonId }) {

        //create room action button is triggered
        if (buttonId===constants.navigation.action_buttons.CREATE_ROOM && !this.state.loading){
            this.generate_create_room_variables()
        }
    }

    validate_inputs = () => {
        return true
    }

    generate_create_room_variables = async() => {

        //TODO:validate the inputs
        if(!this.validate_inputs()){
            return({
                variables:{},
                valid:false
            })
        }

        //considering all inputs are valid
        const {data} = await this.props.client.query({
            query:GET_USER_INFO
        })
        const {user_id} = data.get_user_info

        if(user_id===undefined){
            return({
                variables:{},
                valid:false
            })
        } 
        this.create_room_query({
            variables:{
                creator_id:user_id,
                name:this.state.name, 
                description:this.state.description
            },
            valid:true
        })

    }

    create_room_query = async(create_room_input) => {

        //if the input is invalid then return 
        if (!create_room_input.valid){
            return
        }

        //creating the room using the client
        const create_room_result = await this.props.client.mutate({
            mutation:CREATE_ROOM,
            variables:create_room_input.variables
        })

        //TODO: creating room is done. stop loading and move to room
        console.log(create_room_result, "create_room")

    }

    render(){
        return(
            <ScrollView style={styles.main_container}>
                <SafeAreaView>
                
                    <View style={styles.name_container}>
                        <TextInput
                            value={this.state.name}
                            style={styles.name_text_input}
                            onChangeText={(val)=>{this.setState({name:val})}}
                            placeholder={"Room Name"}
                            placeholderTextColor={"#d9d9d9"}
                        />
                    </View>                        
                    <View style={styles.description_container}>
                        <TextInput
                            value={this.state.description}
                            multiline={true}
                            onChangeText={(val)=>{this.setState({description:val})}}
                            style={styles.description_text_input}
                            placeholder={"Short description of the room..."}
                            placeholderTextColor={"#d9d9d9"}
                        />
                    </View>
                </SafeAreaView>
            </ScrollView>
       )
    }
}

export default withApollo(AddRooms)

const styles = StyleSheet.create({
    main_container:{
        backgroundColor:base_style.color.primary_color,
        flex:1,
        padding:10
    },    
    name_container:{
        width:"100%",
        marginBottom:10
    },
    name_text_input:{
        width:"100%",
        ...base_style.typography.small_header,
        backgroundColor:base_style.color.primary_color_lighter,
        padding:10
    },
    description_container:{
        width:"100%",
        marginBottom:10
    },
    description_text_input:{
        width:"100%",
        ...base_style.typography.small_font_paragraph,
        backgroundColor:base_style.color.primary_color_lighter,
        height:window.height*0.3,
        padding:10
    }

})


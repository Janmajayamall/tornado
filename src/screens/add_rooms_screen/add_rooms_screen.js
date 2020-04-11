import React from "react"
import { 
    StyleSheet,
    SafeAreaView,
    FlatList, 
    Text,
    TextInput,
    View,
    ScrollView,
    Dimensions,
    Alert
} from "react-native";
import PropTypes from "prop-types"
import { 
    withApollo,
} from "react-apollo";
import { Navigation } from "react-native-navigation"

import base_style from "./../../styles/base"

//importing custom components
import Loader from "./../../custom_components/loading/loading_component"

//import graphql queries/mutations
import {
    GET_ALL_JOINED_ROOMS,
    CREATE_ROOM,
    GET_USER_INFO,
    GET_ROOMS
} from "./../../apollo_client/apollo_queries/index"

//importing helpers
import {
    constants,
    validate_room_description,
    validate_room_name
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
            name:{
                value:"",
                error:false,
                error_text:""
            },
            description:{
                value:"",
                error:false,
                error_text:""
            },

            //loading state
            loading:false
        }

        //binding the topBar add post button 
        Navigation.events().bindComponent(this);
    }

    //react native navigation event binded function for action buttons
    navigationButtonPressed({ buttonId }) {

        //create room action button is triggered
        if (buttonId===constants.navigation.action_buttons.CREATE_ROOM && !this.state.loading){
            this.create_room_mutation_wrapper()
        }
    }

    validate_inputs = async() => {

        let all_inputs_valid = true
        let new_input_objects = {}
        
        //validate room name
        const name_validation = await validate_room_name(this.state.name.value, this.props.client)
        if(!name_validation.valid){
            all_inputs_valid=false
            new_input_objects.name={
                ...this.state.name,
                error:true,
                error_text:name_validation.error_text
            }
        }else{
            new_input_objects.name={
                ...this.state.name,
                error:false
            }
        }

        //validate room description
        const description_validation = validate_room_description(this.state.description.value)
        if(!description_validation.valid){
            all_inputs_valid=false
            new_input_objects.description={
                ...this.state.description,
                error:true,
                error_text:description_validation.error_text
            }
        }else{
            new_input_objects.description={
                ...this.state.description,
                error:false,
            }
        }

        //checking whether all inputs valid or not
        if(!all_inputs_valid){
            this.setState((prev_state)=>{
                return({
                    ...prev_state,
                    ...new_input_objects
                })
            })
        }

        return all_inputs_valid
    }

    create_room_mutation = async() => {

        //if loading state is true then return 
        if(this.state.loading){
            return
        }

        //otherwise make the loading state true
        this.setState({
            loading:true
        })

        //validate the inputs
        const inputs_valid = await this.validate_inputs()
        if(!inputs_valid){
            //if input validation is false, then set loading state to false
            this.setState({
                loading:false
            })
            return
        }

        //considering all inputs are valid
        const {data} = await this.props.client.query({
            query:GET_USER_INFO
        })
        const {user_id} = data.get_user_info

        //creating the room using the client
        const create_room_result = await this.props.client.mutate({
            mutation:CREATE_ROOM,
            variables:{
                creator_id:user_id,
                name:this.state.name.value.trim(), 
                description:this.state.description.value
            },
            refetchQueries:[
                {
                    query:GET_ALL_JOINED_ROOMS,
                    variables:{}
                },
                {
                    query:GET_ROOMS,
                    variables:{
                        name_filter:""
                    }
                }
            ]
        })

        //popping add_rooms screen
        Navigation.pop(this.props.componentId)
    }

    create_room_mutation_wrapper = async() => {

        //if loading is true then return 
        if(this.state.loading){
            return
        }

        try{
            await this.create_room_mutation()
            return
        }catch(e){ 
            Alert.alert(
                "Sorry",
                "Something went wrong. Not able to create new room",
                [
                    {text: 'OK', onPress: () => {
                        this.setState({
                            loading:false
                        })
                    }},
                ],
                { cancelable: false }
            )
            return
        }
    }

    change_room_name = (val) => {
        
        this.setState((prev_state)=> {
            return({
                name:{
                    ...prev_state.name,
                    value:val.toLowerCase().trim()
                }
            })
        })
    }

    change_room_description = (val) => {

        this.setState((prev_state)=> {
            return({
                description:{
                    ...prev_state.description,
                    value:val
                }
            })
        })
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
            <ScrollView style={styles.main_container}>
                <SafeAreaView>
                
                    <View style={styles.name_container}>
                        <TextInput
                            value={this.state.name.value}
                            style={styles.name_text_input}
                            onChangeText={this.change_room_name}
                            placeholder={"Room Name"}
                            placeholderTextColor={base_style.typography.font_colors.text_input_placeholder}
                        />
                        {
                            this.state.name.error ? 
                            <View style={styles.error_view}>
                                <Text style={styles.error_text}>
                                    {this.state.name.error_text}
                                </Text>
                            </View>:
                            undefined
                        }   
                    </View>                        
                    <View style={styles.description_container}>
                        <TextInput
                            value={this.state.description.value}
                            multiline={true}
                            onChangeText={this.change_room_description}
                            style={styles.description_text_input}
                            placeholder={"Short description of the room..."}
                            placeholderTextColor={base_style.typography.font_colors.text_input_placeholder}
                        />
                        {
                            this.state.description.error ? 
                            <View style={styles.error_view}>
                                <Text style={styles.error_text}>
                                    {this.state.description.error_text}
                                </Text>
                            </View>:
                            undefined
                        }   
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
        ...base_style.typography.small_font,
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
        height:window.height*0.3,
        padding:10,
        borderColor:base_style.color.primary_color_lighter,
        borderWidth:2.5,
    },
    error_view:{
        paddingTop:2
    },
    error_text:{
        ...base_style.typography.mini_font
    }

})

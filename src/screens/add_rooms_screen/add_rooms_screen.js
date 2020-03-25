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
    Query, ApolloConsumer, Mutation
} from "react-apollo";

import base_style from "./../../styles/base"

//import graphql queries/mutations
import {
    GET_ALL_JOINED_ROOMS,
    CREATE_ROOM
} from "./../../apollo_client/apollo_queries/index"

//importing custom components 
import BigButton from "../../custom_components/buttons/big_buttons";
import ApolloClient from "apollo-client";

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
            description:""
        }
    }

    validate_inputs = () => {
        return false
    }

    generate_create_room_variables = (client) => {

        //TODO:validate the inputs
        if(!this.validate_inputs()){
            return({
                variables:{},
                valid:false
            })
        }

        //considering all inputs are valid
        const {user_info} = client.readQuery({
            query:GET_LOCAL_USER_INFO
        })
        if(user_info.user_id===undefined){
            return({
                variables:{},
                valid:false
            })
        }
        return({
            variables:{
                creator_id:user_info.user_id,
                name:this.state.name, 
                description:this.state.description
            },
            valid:true
        })

    }

    render(){
        return(
            <ApolloConsumer>
                {client=>{
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
                                <Mutation mutation={CREATE_ROOM}>
                                    {(create_room, {data})=>{
                                        return(
                                            <BigButton
                                                button_text={"Create Room"}
                                                onPress={()=>{
                                                    const {variables, valid} = this.generate_create_room_variables(client)

                                                    //if the input is invalid then return 
                                                    if (!valid){
                                                        return
                                                    }

                                                    //creating the room 
                                                    create_room({
                                                        variables:variables
                                                    })
                                                }}
                                            />
                                        )
                                    }}
                                </Mutation>                                                                
                            </SafeAreaView>
                        </ScrollView>
                    )
                }}
            </ApolloConsumer>
       )
    }
}

export default AddRooms

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


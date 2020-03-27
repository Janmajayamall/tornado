import React from "react"
import { 
    View,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    Dimensions
} from "react-native";
import {
    Mutation,
    ApolloConsumer
} from "react-apollo"
import {Navigation} from "react-native-navigation"

//importing base style 
import base_style from "../../styles/base"

//importing helpers
import {  
    upload_image_to_s3
} from "./../../helpers/index";

//importing custom components
import BigButton from "../../custom_components/buttons/big_buttons"
import SmallButton from "../../custom_components/buttons/small_button"
import ChoosePostImage from "../../custom_components/choose_image/choose_post_image"
import client from "../../apollo_client/client_configuration";

//importing all screens
import { 
    CREATE_POST_ROOM_SELECT_SCREEN
 } from "../../navigation/screens";

//importing queries and mutations
import {  
    GET_PRESIGNED_URL,
    GET_LOCAL_USER_INFO,
    CREATE_ROOM_POST
} from "./../../apollo_client/apollo_queries/index";

const window = Dimensions.get("window")

class CreateRoomPosts extends React.PureComponent{

    constructor(props){
        super(props)

        this.state = {
            image_object:{},
            urls:{},
            rooms_id_set:new Set(),
            description:""
        }

        //refs
        this.choose_post_image_ref = React.createRef()
    }

    get_img_object = (img_obj) => {
        console.log(img_obj)
        this.setState({
            image_object:img_obj
        })
    }

    add_room_to_set = (room_id) => {
        if (this.state.rooms_id_set.has(room_id)){
            return
        }else{
            this.setState((prev_state)=>{
                const new_set = prev_state.rooms_id_set
                new_set.add(room_id)
                return({rooms_id_set:new_set})
            })
        }
    }

    remove_room_from_set = (room_id) => {
        if (!this.state.rooms_id_set.has(room_id)){
            return
        }else{
            this.setState((prev_state)=>{
                const new_set = prev_state.rooms_id_set
                new_set.delete(room_id)
                return({rooms_id_set:new_set})
            })
        }
    }

    choose_post_image = (client) =>{
        this.choose_post_image_ref.current.select_image_from_device(client)
    }

    open_room_select_modal = () => {
        Navigation.showModal({
            stack: {
              children: [{
                component: {
                  name: CREATE_POST_ROOM_SELECT_SCREEN,
                  passProps: {
                    add_room_to_set:this.add_room_to_set,
                    remove_room_from_set:this.remove_room_from_set,
                    rooms_id_set:this.state.rooms_id_set,                     
                  }
                }
              }]
            }
          });
          
    }

    componentWillUnmount(){
        console.log("create_room_posts_screen unmounted")
    }

    validate_all_input = () => {
        //TODO: complete the validation
    }

    upload_image_to_s3 = async(client) => {

        try{
            const {data} = await client.query({
                query:GET_PRESIGNED_URL,
                variables:{
                     file_name:this.state.image_object.file_name,
                     file_mime:this.state.image_object.file_mime
                 }
            })

            if(data.get_image_upload_url){
                const result = await upload_image_to_s3(data.get_image_upload_url,this.state.image_object.image_data, this.state.image_object.file_mime)
                return result
            }else{
                throw new Error("did not get presigned url")
            }

        }catch(e){
            throw new Error("did not get presigned url")
        }

    }

    generate_room_ids = () => {

        //TODO: inform the user they haven't selected any room if rooms_arr length is 0
        let final_selected_arr = []
        //iterating through selected indexes
        for(let room_id of this.state.rooms_id_set){
            final_selected_arr.push(room_id)
        }

        return final_selected_arr

    }

    generate_create_post_variables = async(client) => {

        //TODO:validate all this inputs

        //get the user_id
        const {user_info} = client.readQuery({
            query:GET_LOCAL_USER_INFO
        })

        //generate room ids 
        const room_ids = this.generate_room_ids(user_info.user_id)

        //generating create_post_variables
        let create_post_object = {
            creator_id:user_info.user_id,
            description:this.state.description,
            room_ids:room_ids,
            post_type:"ROOM_POST"
        }

        //if image is added to the post then upload it first
        if(Object.keys(this.state.image_object).length>0){
            await this.upload_image_to_s3(client)
            create_post_object.image = {
                image_name:this.state.image_object.file_name,
                width:this.state.image_object.width, 
                height:this.state.image_object.height
            }
        }

        return create_post_object
    }

    render(){
        return(
            <ApolloConsumer>
                {
                    client=>{
                        return(
                            <ScrollView style={styles.main_container}>
                                <SafeAreaView >
                
                                    <ChoosePostImage
                                        upload_img_s3={this.get_img_object}
                                        ref={this.choose_post_image_ref}
                                        width={window.width}
                                    />
                                    <View style={styles.description_container}>
                                        <TextInput
                                            style={styles.description_text_input}
                                            multiline={true}
                                            value={this.state.description}
                                            onChangeText={(val)=>{this.setState({description:val})}}
                                            placeholder={`Type what you want to share! \n \n Note: feel free to include urls of your content elsewhere!`}
                                            placeholderTextColor={"#ffffff"}
                                        />
                                    </View>
                                    <View style={styles.choose_container}>
                                        <SmallButton
                                            button_text="Add Image"
                                            // width={window.width/3}
                                            onPress={()=>{this.choose_post_image(client)}}
                                        />
                                        <SmallButton
                                            button_text="Select Rooms"
                                            // width={window.width/3}
                                            onPress={this.open_room_select_modal}
                                        />
                                    </View>
                                    <Mutation mutation={CREATE_ROOM_POST}>
                                        {(create_room_post, {data})=>{

                                            if(data){
                                                console.log("post created")
                                            }

                                            return(
                                                <BigButton
                                                    button_text={"Share"}
                                                    onPress={async ()=> {
                                                        const post_variables = await this.generate_create_post_variables(client)
                                                        create_room_post({
                                                            variables:post_variables
                                                        })
                                                    }}
                                                />
                                            )
                                        }}                                                                               
                                    </Mutation>                                 
                                </SafeAreaView>
                            </ScrollView>
                        )
                    }
                }
            </ApolloConsumer>


        )
    }
}

const styles = StyleSheet.create({
    main_container:{
        backgroundColor:base_style.color.primary_color,
        flex:1
    }, 
    description_container:{
        height:window.height*0.3,
        width:"100%",
        padding:10
    },
    description_text_input:{
        height:"100%",
        width:"100%",
        backgroundColor:base_style.color.primary_color_lighter,
        elevation:5,
        ...base_style.typography.small_font_paragraph,
        color:"#ffffff"
    },
    choose_container:{
        flexDirection:"row",
        width:"100%",
        padding:20
    },
    choose_image_container:{
        width:"100%",
        height:0
    }


})

export default CreateRoomPosts

//TODO: shift the share button to top right on the navigator bar, because it is more UI friendly
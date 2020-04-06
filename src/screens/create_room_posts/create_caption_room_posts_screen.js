
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
    ApolloConsumer,
    withApollo
} from "react-apollo"
import {Navigation} from "react-native-navigation"

//importing base style 
import base_style from "../../styles/base"

//importing helpers
import {  
    upload_image_to_s3,
    constants
} from "./../../helpers/index";

//importing custom components
import BigButton from "../../custom_components/buttons/big_buttons"
import SmallButton from "../../custom_components/buttons/small_button"
import ChoosePostImage from "../../custom_components/choose_image/choose_post_image"
import Loader from "./../../custom_components/loading/loading_component"

//importing all screens
import { 
    CREATE_POST_ROOM_SELECT_SCREEN,
    CREATE_ROOM_POSTS_SCREEN
 } from "../../navigation/screens";
import {
    navigation_push_to_screen
} from "./../../navigation/navigation_routes/index"

//importing queries and mutations
import {  
    GET_PRESIGNED_URL,
    GET_USER_INFO,
    CREATE_ROOM_POST,
    GET_ROOM_FEED,
    GET_USER_PROFILE_POSTS
} from "./../../apollo_client/apollo_queries/index";
import PropTypes from "prop-types"

const window = Dimensions.get("window")

class CreateCaptionRoomPosts extends React.PureComponent{

    static propsTypes={
        client:PropTypes.any,
        switch_screen_func:PropTypes.func,
        componentId:PropTypes.any
    }

    constructor(props){
        super(props)

        this.state = {
            image_object:{},
            urls:{},
            rooms_id_set:new Set(),
            description:"",
            loading:false,

            //image choose phrase
            choose_image_phrase:"Add Photo",
            choose_image_subtext:" to your post."
            
        }

        //refs
        this.choose_post_image_ref = React.createRef()

    }
 

    get_img_object = async(img_obj) => {

        //getting user_info and populating image_object with user_id
        try{
            const {data} = await this.props.client.query({
                query:GET_USER_INFO
            })
            const get_user_info = data.get_user_info
        
            //adding file_name to img_obj
            img_obj.file_name=`${get_user_info.user_id}_${new Date().toISOString()}.${img_obj.file_mime.split("/")[1]}`
            this.setState({
                image_object:img_obj,
                choose_image_phrase:"Choose",
                choose_image_subtext:" some other photo."
            })

        }catch(e){
            console.log(e, "get_img_object function error in create_room_posts_screen.js")
        }
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

    choose_post_image = () =>{
        this.choose_post_image_ref.current.select_image_from_device()
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
                  },
                  options:{
                      topBar:{
                          rightButtons:[
                              {
                                  id:constants.navigation.action_buttons.DONE_POST_ROOM_SELECTION,
                                  text:"Done"
                              }
                          ]
                      }
                  }
                }
              }]
            }
          });
          
    }

    validate_all_input = () => {
        //TODO: complete the validation
        return true
    }

    upload_image_to_s3 = async() => {

        try{
            const {data} = await this.props.client.query({
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

    generate_create_post_variables = async() => {

        //TODO:validate all this inputs
        if(!this.validate_all_input()){
            return({
                valid:false
            })
        }

        //get the user_id
        const {data} = await this.props.client.query({
            query:GET_USER_INFO
        })
        const {user_id} = data.get_user_info

        //generate room ids 
        const room_ids = this.generate_room_ids(user_id)

        //generating create_post_variables
        let variable_object = {
            create_post_object:{
                creator_id:user_id,
                description:this.state.description,
                room_ids:room_ids,
                post_type:constants.post_types.room_caption_post
            },
            valid:true
        }

        //if image is added to the post then upload it first
        if(Object.keys(this.state.image_object).length>0){
            try{
                await this.upload_image_to_s3()
                variable_object.create_post_object.image = {
                    image_name:this.state.image_object.file_name,
                    width:this.state.image_object.width, 
                    height:this.state.image_object.height
                }
            }catch(e){
                console.log(e, "create_room_posts_screen, while image upload to s3")
                variable_object.valid=false
            }
            
        }

        return variable_object
    }

    create_post = async() => {

        //if loading is true then return (perform no action)
        if(this.state.loading){
            return
        }

        //setting the loading state to true
        this.setState({
            loading:true
        })

        //TODO: start loading
        const variable_object = await this.generate_create_post_variables()

        //checking whether variable_object are valid or not
        if (!variable_object.valid){
            console.log("error, encountered")
            return 
        }   
        console.log(variable_object)
        //creating the post
        const {data} = await this.props.client.mutate({
            mutation:CREATE_ROOM_POST,
            variables:variable_object.create_post_object,
            refetchQueries:[
                {
                    query:GET_ROOM_FEED,
                    variables:{
                        limit:5
                    }
                },
                {
                    query:GET_USER_PROFILE_POSTS,
                    variables:{
                        limit:5
                    }
                }
            ]
        })
        
        this.setState({
            loading:false
        })

        //going to previous screen in stack
        Navigation.pop(this.props.componentId)

    }

    render(){

        //if loading is true
        if(this.state.loading){
            return(
                <View style={styles.main_container}>
                    <Loader/>
                </View>
            )
        }

        //if loading is false
        return(
            <ScrollView style={styles.main_container}>
                <SafeAreaView >

                    <BigButton
                        button_text={"Switch to Normal Post"}
                        onPress={()=>{
                            if(this.state.loading){
                                return
                            }
                            this.props.switch_screen_func()
                        }}
                        active={true}
                    />

                    <ChoosePostImage
                        upload_img_s3={this.get_img_object}
                        ref={this.choose_post_image_ref}
                        width={window.width}
                    />
                    <View style={styles.choose_container}>
                        <SmallButton
                            button_text={this.state.choose_image_phrase}
                            // width={window.width/3}
                            onPress={()=>{this.choose_post_image()}}
                        />
                        <Text style={{...base_style.typography.small_font, fontStyle:"italic"}}>
                            {this.state.choose_image_subtext}
                        </Text>
                        
                    </View>   
                    <View style={styles.choose_container}>
                        <SmallButton
                            button_text="Select rooms"
                            // width={window.width/3}
                            onPress={this.open_room_select_modal}
                        />   
                        <Text style={{...base_style.typography.small_font, fontStyle:"italic"}}>
                            {` to share this post with?`}
                        </Text>
                        
                    </View>

                                    
                </SafeAreaView>
            </ScrollView>
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
        padding:10
    },
    choose_image_container:{
        width:"100%",
        height:0
    }


})

export default CreateCaptionRoomPosts

//TODO: shift the share button to top right on the navigator bar, because it is more UI friendly
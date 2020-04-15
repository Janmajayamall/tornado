import React from "react"
import { 
    View,
    Text,
    ScrollView,
    StyleSheet,    
    SafeAreaView,    
    Dimensions,
    Alert
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
            rooms_id_set:new Set(),
            description:"",
            loading:false,

            //image choose phrase
            choose_image_phrase:"Add Photo",
            choose_image_subtext:" to your post.",

            //errors
            set_error:false, 
            image_error:false
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
            img_obj.file_name=`${get_user_info.user_id}_${String(new Date().getTime())}.${img_obj.file_mime.split("/")[1]}`
            this.setState({
                image_object:img_obj,
                choose_image_phrase:"Choose",
                choose_image_subtext:" some other photo."
            })

        }catch(e){
            this.error_alert()
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
                          ],
                          rightButtonColor:base_style.color.icon_selected,
                          background:{
                              color:base_style.color.primary_color
                          }
                      }
                  }
                }
              }]
            }
          });
          
    }

    error_alert = () =>{
        Alert.alert(
            "Sorry",
            "Something went wrong",
            [
                {text: 'OK', onPress: () => {
                    this.setState({
                        loading:false
                    })
                }},
            ],
            { cancelable: false }
        )
    }

    validate_all_input = () => {

        let all_inputs_valid=true
        let new_input_objects={}
        
        //if no image object, then invalid
        if(Object.keys(this.state.image_object).length===0){
            all_inputs_valid=false
            new_input_objects.image_error=true
        }else{
            new_input_objects.image_error=false
        }

        //room_ids set validation 
        if(this.state.rooms_id_set.size===0){

            all_inputs_valid=false

            //set set_error to true 
            new_input_objects.set_error=true
        }else{
            new_input_objects.set_error=false
        }

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
            await this.upload_image_to_s3()
            variable_object.create_post_object.image = {
                image_name:this.state.image_object.file_name,
                width:this.state.image_object.width, 
                height:this.state.image_object.height
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
            this.setState({loading:false})
            return 
        }   
        
        //creating the post
        const {data} = await this.props.client.mutate({
            mutation:CREATE_ROOM_POST,
            variables:variable_object.create_post_object,
            refetchQueries:[
                {
                    query:GET_ROOM_FEED,
                    variables:{
                        limit:constants.apollo_query.pagination_limit
                    }
                },
                {
                    query:GET_USER_PROFILE_POSTS,
                    variables:{
                        limit:constants.apollo_query.pagination_limit
                    }
                }
            ]
        })
        
        this.setState({
            loading:false,
        })

        //going to previous screen in stack
        Navigation.pop(this.props.componentId)
        return

    }

    create_post_wrapper = async() => {
        
        //if loading state is true then return 
        if(this.state.loading){
            return    
        }

        try{
            await this.create_post()
            return
        }catch(e){
            this.error_alert()
            return            
        }

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

                        //if image is already chosen
                        image={this.state.image_object.image_uri ? {
                            image_uri:this.state.image_object.image_uri,
                            height:this.state.image_object.height,
                            width:this.state.image_object.width
                        }:undefined}
                    />
                    <View style={styles.choose_container}>
                        <SmallButton
                            button_text={this.state.choose_image_phrase}
                            // width={window.width/3}
                            onPress={()=>{this.choose_post_image()}}
                        />
                        <Text style={{...base_style.typography.small_font, fontStyle:"italic",   alignSelf:"center"}}>
                            {this.state.choose_image_subtext}
                        </Text>
                        
                    </View>   
                    <View style={styles.choose_container}>
                        <SmallButton
                            button_text="Select rooms"
                            // width={window.width/3}
                            onPress={this.open_room_select_modal}
                        />   
                        <Text style={{...base_style.typography.small_font, fontStyle:"italic",   alignSelf:"center"}}>
                            {` to share this post with?`}
                        </Text>                        
                    </View>
                    {
                        this.state.image_error ? 
                        <View style={styles.error_view}>
                            <Text style={styles.error_text}>
                                Choose a photo to post
                            </Text>
                        </View>:
                        undefined
                    }  
                    {
                        this.state.set_error ? 
                        <View style={styles.error_view}>
                            <Text style={styles.error_text}>
                                Choose at least one room to post this to.
                            </Text>
                        </View>:
                        undefined
                    }                                      
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
    },
    error_view:{
        padding:10
    },
    error_text:{
        ...base_style.typography.mini_font
    }
})

export default CreateCaptionRoomPosts

//TODO: shift the share button to top right on the navigator bar, because it is more UI friendly
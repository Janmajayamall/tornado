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
    Dimensions,
    KeyboardAvoidingView,
    Alert
} from "react-native";
import {
    Mutation,
    ApolloConsumer,
    withApollo
} from "react-apollo"
import {Navigation} from "react-native-navigation"
import PropTypes from "prop-types"

//importing base style 
import base_style from "../../styles/base"

//importing helpers
import {  
    upload_image_to_s3,
    validate_post_description
} from "./../../helpers/index";

//importing custom components
import BigButton from "../../custom_components/buttons/big_buttons"
import SmallButton from "../../custom_components/buttons/small_button"
import ChoosePostImage from "../../custom_components/choose_image/choose_post_image"
import Loader from "./../../custom_components/loading/loading_component"

//importing all screens
import { 
    CREATE_POST_ROOM_SELECT_SCREEN, 
    CREATE_CAPTION_ROOM_POSTS_SCREEN
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

//helpers
import {
    constants
} from "./../../helpers/index"

const window = Dimensions.get("window")

class CreateRoomPosts extends React.PureComponent{

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
            description:{
                value:"",
                error:false,
                error_text:""
            },
            loading:false,

            //image choose phrase
            choose_image_phrase:"Add Photo",
            choose_image_subtext:" to your post?"
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

                //choose photo phrases
                choose_image_phrase:"Change",
                choose_image_subtext:" photo?"
            })

        }catch(e){
            this.error_alert()
        }
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
                          rightButtonColor:base_style.color.primary_color,
                          background:{
                              color:base_style.color.icon_selected
                          }
                      }
                  }
                }
              }]
            }
          });
          
    }

    validate_all_input = () => {

        let all_inputs_valid = true
        let new_input_objects = {}
        
        //validating description
        const description_validation = validate_post_description(this.state.description.value)
        if(!description_validation.valid){
            all_inputs_valid=false
            new_input_objects.description={
                ...this.state.description,
                error:true, 
                error_text:description_validation.error_text
            }
        }else{
    
            //if description is none && no image
            if(this.state.description.value.trim()==="" && Object.keys(this.state.image_object).length===0){
                //throw an error that at least one of them should be present
                all_inputs_valid=false 
                new_input_objects.description={
                    ...this.state.description,
                    error:true,
                    error_text:"Either choose a Image or write something."
                }
            }else{
                new_input_objects.description={
                    ...this.state.description,
                    error:false
                }
            }

        }

        //room_ids set validation 
        if(this.state.rooms_id_set.size===0){

            all_inputs_valid=false

            //set set_error to true 
            new_input_objects.set_error=true
        }else{
            new_input_objects.set_error=false
        }

        //all inputs are not valid
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

        //validate all this inputs
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
        const room_ids = this.generate_room_ids()

        //generating create_post_variables
        let variable_object = {
            create_post_object:{
                creator_id:user_id,
                description:this.state.description.value,
                room_ids:room_ids,
                post_type:constants.post_types.room_post
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
        //check if the screen is already in loading state, if yes the create post does not responds
        if(this.state.loading){
            return
        }

        //setting loading to true
        this.setState({
            loading:true
        })

        //TODO: start loading
        const variable_object = await this.generate_create_post_variables()

        //checking whether variable_object are valid or not
        if (!variable_object.valid){            
            this.setState({
                loading:false
            })
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
            loading:false
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
        }

    }

    render(){

        //if loading state is true
        if(this.state.loading){
            return(
                <View style={styles.main_container}>
                    <Loader/>
                </View>
            )
        }

        //if loading state is false
        return(
            <ScrollView
                style={styles.main_container}
            >
                <KeyboardAvoidingView 
                    behavior={"padding"}
                    >
                    <SafeAreaView >

                        <BigButton
                            button_text={"Switch to Caption Post"}
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
                        {
                            this.state.description.error ? 
                            <View style={styles.error_view}>
                                <Text style={styles.error_text}>
                                    {this.state.description.error_text}
                                </Text>
                            </View>:
                            undefined
                        }   
                        <View style={styles.description_container}>                    
                            <TextInput
                                style={styles.description_text_input}
                                multiline={true}
                                value={this.state.description.value}
                                onChangeText={(val)=>{
                                    this.setState((prev_state)=>{
                                        return({
                                            description:{
                                                ...prev_state.description,
                                                value:val
                                            }
                                        })
                                    })
                                }}
                                placeholder={`Type what you want to share! \n \n Note: feel free to include urls of your content elsewhere!`}
                                placeholderTextColor={base_style.typography.font_colors.text_input_placeholder}
                            />                  
                        </View>
                        <View style={styles.choose_container}>
                            <SmallButton
                                button_text={this.state.choose_image_phrase}
                                // width={window.width/3}
                                onPress={()=>{this.choose_post_image()}}
                            />
                            <Text style={{...base_style.typography.small_font, fontStyle:"italic",  alignSelf:"center"}}>
                                {this.state.choose_image_subtext}
                            </Text>
                            
                        </View>   
                        <View style={styles.choose_container}>
                            <SmallButton
                                button_text="Select rooms"
                                // width={window.width/3}
                                onPress={this.open_room_select_modal}
                            />   
                            <Text style={{...base_style.typography.small_font, fontStyle:"italic", alignSelf:"center"}}>
                                {` to share this post with?`}
                            </Text>                                         
                        </View>
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
                </KeyboardAvoidingView>
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
        ...base_style.typography.small_font_paragraph,
        color:"#ffffff",
        borderColor:base_style.color.primary_color_lighter,
        borderWidth:2.5,
        padding:5,
        textAlignVertical:"top"
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

export default CreateRoomPosts

//TODO: shift the share button to top right on the navigator bar, because it is more UI friendly
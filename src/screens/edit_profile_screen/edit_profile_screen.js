import React from "react"
import {  
    StyleSheet, 
    Dimensions,
    Text,
    TouchableWithoutFeedback,
    ScrollView,
    View,
    Keyboard
} from "react-native";
import { Navigation } from "react-native-navigation"
import PropTypes from "prop-types"

//importing custom components
import ChooseAvatar from "./../../custom_components/choose_image/choose_avatar"
import BigTextInput from "./../../custom_components/text_inputs/big_input_text"
import { 
    withApollo 
} from "react-apollo";

//importing graphql mutation/queries
import {  
    GET_USER_INFO,
    EDIT_USER_PROFILE
} from "./../../apollo_client/apollo_queries/index";

//importing helpers
import { 
    //validations 
    validate_three_words,
    validate_username,
    validate_name,
    validate_bio,

    //aws s3 related
    get_presigned_url,
    upload_image_to_s3,
    
    constants,

    //authentication
    setting_up_the_user
    
} from "./../../helpers/index";
import { EDIT_PROFILE_SCREEN } from "../../navigation/screens";

const window = Dimensions.get("window")

class EditProfile extends React.PureComponent {

    static propTypes = {
        render_edit_profile_screen:PropTypes.func
    }

    constructor(props){
        super(props)

        this.state = {

            //keyboard safe
            main_container_bottom_padding:0,

            //image_upload
            loading:true

        }

        // getting user_profile
        this.load_user_profile()

        //binding the topBar add post button 
        Navigation.events().bindComponent(this);

    }

    //react native navigation event binded function for action buttons
    navigationButtonPressed({ buttonId }) {
        if(buttonId === constants.navigation.action_buttons.EDIT_PROFILE){
            this.edit_profile_mutation_wrapper()
        }
    }


    load_user_profile = async() => {

        try{
            const {data, loading, error} = await this.props.client.query({
                query:GET_USER_INFO
            })
            const get_user_info = data.get_user_info
            this.setup_edit_profile_state(get_user_info)
        }catch(e){
            console.log(e, "edit_profile_screen.js error")
        }

    }


    validate_inputs = async() =>{

        let all_inputs_valid = true
        let new_input_objects = {}

        //validating three words
        const three_words_validation = validate_three_words(this.state.three_words.value)
        if(!three_words_validation.valid){
            all_inputs_valid=false
            new_input_objects.three_words = {
                ...this.state.three_words,
                error:true,
                error_text:three_words_validation.error_text
            }
        }else{
            new_input_objects.three_words = {
                ...this.state.three_words,
                error:false,
            }
        }

        //validating username
        const username_validation = await validate_username(this.state.username.value, this.props.client)
        if(!username_validation.valid){
            all_inputs_valid=false
            new_input_objects.username={
                ...this.state.username,
                error:true,
                error_text:username_validation.error_text
            }
        }else{
            new_input_objects.username={
                ...this.state.username,
                error:false,
            }
        }

        //validating bio
        const bio_validation = validate_bio(this.state.bio.value)
        if(!bio_validation.valid){
            all_inputs_valid=false
            new_input_objects.bio={
                ...this.state.bio,
                error:true,
                error_text:bio_validation.error_text
            }
        }else{
            new_input_objects.bio={
                ...this.state.bio,
                error:false,
            }
        }

        //validating name
        const name_validation = validate_name(this.state.name.value)
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
                error:false,
            }
        }

        //if even one of the inputs are not valid, update the state
        
        this.setState({
            three_words:new_input_objects.three_words,
            username:new_input_objects.username,
            bio:new_input_objects.bio,
            name:new_input_objects.name
        })

        return all_inputs_valid
    }

    edit_profile_mutation = async() => {

        // if loading state is true then return 
        if(this.state.loading){
            return
        }

        // enable loading state
        this.setState({loading:true})

        //validate the input 
        const all_inputs_valid = await this.validate_inputs()
        console.log(all_inputs_valid)

        if(!all_inputs_valid){
            this.setState({loading:false})
            return //no need to process further
        }


        //generating edit_user_profile_variables
        let edit_user_profile_variables = {
            name:this.state.name.value.trim(),
            username:this.state.username.value.trim(),
            bio:this.state.bio.value.trim(),
            three_words:this.state.three_words.value.trim()
        }

        //upload the image, if image has been changed
        if (Object.keys(this.state.chosen_avatar).length > 0){
            //get presigned url 
            const presigned_upload_url = await get_presigned_url(this.props.client, this.state.chosen_avatar.file_name, this.state.chosen_avatar.file_mime)
            //uploading the image to s3
            await upload_image_to_s3(presigned_upload_url, this.state.chosen_avatar.image_data, this.state.chosen_avatar.file_mime)    
            
            //populating edit_user_profile_variables with avatar & last_avatar_id
            edit_user_profile_variables.avatar = {
                image_name:this.state.chosen_avatar.file_name,
                width:this.state.chosen_avatar.width,
                height:this.state.chosen_avatar.height
            }
            if(this.state.current_avatar){
                edit_user_profile_variables.last_avatar_id = this.state.current_avatar._id
            }      
        }

        // mutating the user_profile
        const {data} = await this.props.client.mutate({
            mutation:EDIT_USER_PROFILE,
            variables:edit_user_profile_variables
        })

        //re-rendering the profile screen
        this.props.render_edit_profile_screen()
        console.log("aass")
        //go back
        Navigation.pop(this.props.componentId)
        return 
    }

    edit_profile_mutation_wrapper = async() => {

        if(this.state.loading){ //loading is true
            return
        }


        try{
            await this.edit_profile_mutation()
            return
        }catch(e){
            console.log(e, "edit_profile_screen.js")
            this.setState({loading:false})
            //TODO: Notify the user about the error
            return 
        }

    }

    setup_edit_profile_state = (user_info) => {
        console.log(user_info)
        const state_text_input = {
            username:{
                value:user_info.username,
                error:false,
                error_text:"Please enter your preferred username"
            },
            three_words:{
                value:user_info.three_words,
                error:false,
                error_text:"A 3-4 word long description of yours"
            },
            name:{
                value:user_info.name,
                error:false,
                error_text:"Please enter your name"
            },
            bio:{
                value:user_info.bio,
                error:false,
                error_text:"Please enter bio"
            },
            chosen_avatar:{},
            current_avatar:user_info.avatar,
            default_avatar:user_info.default_avatar
        }
        this.setState({
            ...state_text_input,
            loading:false
        })

    }

    //change input values functions
    change_bio = (val) => {
        this.setState({
            bio:{
                ...this.state.bio,
                value:val,
                error:false
            }
        })
    }

    change_name = (val) => {
        this.setState({
            name:{
                ...this.state.name,
                value:val,
                error:false
            }
        })
    }

    change_three_words = (val) => {
        this.setState({
            three_words:{
                ...this.state.three_words,
                value:val,
                error:false
            }
        })
    }

    change_username = (val) => {

        this.setState({
            username:{
                ...this.state.username,
                value:val.toLowerCase().trim(),
                error:false
            }
        })
    }

    get_img_object = (img_obj) => {
        this.setState({
            chosen_avatar:img_obj,
        })
    }

    get_choose_image_uri = () => {

        if(Object.keys(this.state.chosen_avatar).length>0){
            return this.state.chosen_avatar.image_uri
        }

        if(!this.state.default_avatar){
            return `${this.state.current_avatar.cdn_url}/${this.state.current_avatar.image_name}`
        }   

        return undefined
    }

    render(){

        if (this.state.loading){
            return(
                <Text>
                    Loading.....
                </Text>
            )
        }

        return(
            <TouchableWithoutFeedback
                onPress={()=>{
                    Keyboard.dismiss()
                }}
            >
                <ScrollView 
                    contentContainerStyle={styles.main_scroll_container}
                    style={[styles.main_container, {paddingBottom:this.state.main_container_bottom_padding}]}
                    >
                    <View style={styles.input_box}> 
                        <ChooseAvatar
                            width={window.width*0.8}
                            upload_img_s3={this.get_img_object}
                            username={this.state.username.value}                            
                            image_uri={this.get_choose_image_uri()}
                        />
                    </View>
                    <View style={styles.input_box}>
                        <BigTextInput
                            placeholder={"Username"}
                            type="TEXT"
                            value={this.state.username.value}
                            onChangeText={this.change_username}
                            error_state={this.state.username.error}
                            error_text={this.state.username.error_text}
                        />
                    </View>

                    <View style={styles.input_box}>
                        <BigTextInput
                            placeholder={"Name"}
                            type="TEXT"
                            value={this.state.name.value}
                            onChangeText={this.change_name}
                            error_state={this.state.name.error}
                            error_text={this.state.name.error_text}
                        />
                    </View>
                    <View style={styles.input_box}>
                        <BigTextInput
                            placeholder={"You in 3-4 words?"}
                            type="TEXT"
                            value={this.state.three_words.value}
                            onChangeText={this.change_three_words}
                            error_state={this.state.three_words.error}
                            error_text={this.state.three_words.error_text}                            
                        />
                    </View>
                    <View style={styles.input_box}>
                        <BigTextInput
                            placeholder={"Something about you..."}
                            type="PARAGRAPH"
                            value={this.state.bio.value}
                            onChangeText={this.change_bio}
                            error_state={this.state.bio.error}
                            error_text={this.state.bio.error_text}
                            height={window.height*0.3}
                        />
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>                    
        )
    }

}

const styles = StyleSheet.create({
    main_container:{
        backgroundColor:base_style.color.primary_color,
        paddingTop:20
    },
    main_scroll_container:{
        justifyContent:"flex-start",
        alignItems:"center",
        flex:1,
    },
    input_box:{
        width:"90%",
        marginBottom:10
    }
})

export default withApollo(EditProfile)
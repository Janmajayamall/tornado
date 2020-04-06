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
            this.edit_profile_mutation()
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


    validate_the_input = () =>{

        let all_inputs_valid = true

        let new_input_objects = {}

        //validating three words
        if (!validate_three_words(this.state.three_words.value)){
            all_inputs_valid = false
            new_input_objects.three_words = {...this.state.three_words, error:true}
        }

        //validating username
        if (!validate_username(this.state.username.value)){
            all_inputs_valid = false
            new_input_objects.username = {...this.state.username, error:true}
        }

        //validating bio
        if (!validate_bio(this.state.bio.value)){
            all_inputs_valid = false
            new_input_objects.bio = {...this.state.bio, error:true}
        }

        //validating name
        if (!validate_name(this.state.name.value)){
            all_inputs_valid = false
            new_input_objects.name = {...this.state.name, error:true}
        }

        //if even one of the inputs are not valid, update the state
        
        if (!all_inputs_valid){
            this.setState((prev_state)=>{
                return({
                    ...prev_state,
                    ...new_input_objects
                })
            })
        }

        return all_inputs_valid
    }

    edit_profile_mutation = async() => {

        //TODO: enable loading state

        //validate the input 
        if(!this.validate_the_input()){
            return
        }

        //generating edit_user_profile_variables
        let edit_user_profile_variables = {
            name:this.state.name.value,
            username:this.state.username.value,
            bio:this.state.bio.value,
            three_words:this.state.three_words.value
        }

        //upload the image, if image has been changed
        if (Object.keys(this.state.chosen_avatar).length > 0){
            try{
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

            }catch(e){
                console.log(e, "Error in uploading image, edit_profile_screen")
            }        
        }

        // mutating the user_profile
        const {data} = await this.props.client.mutate({
            mutation:EDIT_USER_PROFILE,
            variables:edit_user_profile_variables
        })

        //re-rendering the profile screen
        this.props.render_edit_profile_screen()

        //go back
        Navigation.pop(this.props.componentId)
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
                value:val
            }
        })
    }

    change_name = (val) => {
        this.setState({
            name:{
                ...this.state.name,
                value:val
            }
        })
    }

    change_three_words = (val) => {
        this.setState({
            three_words:{
                ...this.state.three_words,
                value:val
            }
        })
    }

    change_username = (val) => {
        this.setState({
            username:{
                ...this.state.username,
                value:val
            }
        })
    }

    get_img_object = (img_obj) => {
        this.setState({
            chosen_avatar:img_obj,
        })
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
                            image_uri={!this.state.default_avatar?`${this.state.current_avatar.cdn_url}/${this.state.current_avatar.image_name}`:undefined}
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
import React from "react"
import { 
    View,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    Dimensions
} from "react-native";
import {
    Mutation,
    ApolloConsumer,
    withApollo
} from "react-apollo"
import PropTypes from "prop-types"
import {
    setting_up_the_user,
    validate_three_words,
    validate_age,
    setting_up_jwt_token
} from "./../../helpers/index"
import { 
    upload_image_to_s3,
    get_presigned_url
 } from "./../../helpers/index";

//importing base style 
import base_style from "./../../styles/base"

//importing graphql queries
import {REGISTER_USER, GET_PRESIGNED_URL} from "./../../apollo_client/apollo_queries/index"
import base from "./../../styles/base";

//import custom components
import BigTextInput from "./../../custom_components/text_inputs/big_input_text"
import BigButton from "./../../custom_components/buttons/big_buttons"
import ChooseAvatar from "./../../custom_components/choose_image/choose_avatar"
import Loader from "./../../custom_components/loading/loading_component"

// importing navigation routes
import {  
    navigation_push_to_screen,
    navigation_set_root_one_screen,
    navigation_set_root_two_bottoms_tabs
} from "./../../navigation/navigation_routes/index";
import {  
    EXPLORE_ROOMS_SCREEN
} from "./../../navigation/screens";

const window = Dimensions.get("window")

class RegisterOtherAtt extends React.PureComponent{

    static propTypes = {
        email:PropTypes.string,
        username:PropTypes.string,
        password:PropTypes.string,   
    }

    constructor(props){
        super(props)

        this.state = {
            age:{
                value:"",
                error:false,
                error_text:""
            },
            three_words:{
                value:"",
                error:false,
                error_text:""
            },
            name:{
                value:"",
                error:false,
                error_text:""
            },
            bio:{
                value:"",
                error:false,
                error_text:""
            },

            //keyboard safe
            main_container_bottom_padding:0,

            //image_upload
            avatar_img_obj:{},

            //loading
            loading:false
        }

    }

    componentDidMount(){
        this.keyboard_did_show_listener = Keyboard.addListener("keyboardWillShow", this._keyboard_did_show)
        this.keyboard_will_hide_listener = Keyboard.addListener("keyboardWillHide", this._keyboard_will_hide)
    }

    _keyboard_did_show = (e) => {
        if (e){
            this.setState({main_container_bottom_padding:e.endCoordinates.height})
        }
    }   

    _keyboard_will_hide = (e) => {
        this.setState({main_container_bottom_padding:0})
    }

    validate_the_input = () =>{

        let all_inputs_valid = true

        let new_input_objects = {}

        //validate age
        let age_validation = validate_age(this.state.age.value)
        if(!age_validation.valid){
            all_inputs_valid=false
            new_input_objects.age = {
                ...this.state.age,
                error:true, 
                error_text:age_validation.error_text
            }
        }else{
            new_input_objects.age = {
                ...this.state.age,
                error:false,                 
            }
        }

        //validate name
        let three_words_validation = validate_three_words(this.state.three_words.value)
        if(!three_words_validation.valid){
            all_inputs_valid=false
            new_input_objects.three_words={
                ...this.state.three_words,
                error:true,
                error_text:three_words_validation.error_text
            }
        }else{
            new_input_objects.three_words={
                ...this.state.three_words,
                error:false,
            }
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


    change_three_words = (val) => {
        this.setState({
            three_words:{
                ...this.state.three_words,
                value:val
            }
        })
    }

    change_age = (val) => {
        this.setState({
            age:{
                ...this.state.age,
                value:val
            }
        })
    }

    get_img_object = (img_obj) => {
        this.setState({
            avatar_img_obj:img_obj
        })
    }

    register_user_request = async() => {

        //if loading state is true then return 
        if(this.state.loading){
            return                                                                            
        }
        // otherwise validate the input and progress & set state loading=true
        this.setState({loading:true})
        
        
        //validate the input
        if(!this.validate_the_input()){
            this.setState({loading:false})
            return
        }

        //generating register_user query variables
        let register_user_variables = {                                                                        
                email:this.props.email.trim().toLowerCase(),
                password:this.props.password.trim(),
                username:this.props.username.trim().toLowerCase(),

                age:parseInt(this.state.age.value),
                name:this.state.name.value.trim(), 
                three_words:this.state.three_words.value.trim(),
                bio:this.state.bio.value.trim(),                                                                                
            }

        //checking whether the user has uploaded a default picture
        if (Object.keys(this.state.avatar_img_obj).length>0){
                  
            //getting presigned url and uploading the image
            const presigned_upload_url = await get_presigned_url(this.props.client, this.state.avatar_img_obj.file_name, this.state.avatar_img_obj.file_mime)
            await upload_image_to_s3(presigned_upload_url, this.state.avatar_img_obj.image_data, this.state.avatar_img_obj.file_mime)                                

            //updating register_user_variables with avatar
            register_user_variables.avatar={
                image_name:this.state.avatar_img_obj.file_name,
                width:this.state.avatar_img_obj.width,
                height:this.state.avatar_img_obj.height
            }
            register_user_variables.default_avatar=false
        }else{
            register_user_variables.default_avatar=true
        }  
        console.log("register variables", register_user_variables)
        //registering the user
        const {data} = await this.props.client.mutate({
            mutation:REGISTER_USER,
            variables:register_user_variables
        })
        
        await setting_up_jwt_token(data.register_user.jwt)

        navigation_set_root_one_screen({screen_name:EXPLORE_ROOMS_SCREEN})

        return 
    }

    register_user_wrapper = async() => {
        try{
            await this.register_user_request()
            return
        }catch(e){
            console.log(e, "register_other_att.js")
            //TODO: make error state true
        }
    }

    render(){

        if(this.state.loading){
            return(
                <View style={[styles.main_container, {flex:1}]}>
                    <Loader/>
                </View>
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
                            username={this.props.username}
                            image_uri={undefined}
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
                            placeholder={"Your age?"}
                            type="NUMBER"
                            value={this.state.age.value}
                            onChangeText={this.change_age}
                            error_state={this.state.age.error}
                            error_text={this.state.age.error_text}
                        />
                    </View>
                    <View style={styles.input_box}>

                        <BigButton
                            button_text={"Register"}        
                            onPress={()=>{this.register_user_wrapper()}}                                                                
                            active={true}
                        />  
                                                                 
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>                    

        )
    }
}

const styles = {
    main_container:{
        backgroundColor:base_style.color.primary_color,
    },
    main_scroll_container:{
        justifyContent:"center",
        alignItems:"center",
        flex:1,
    },
    input_box:{
        width:"80%",
        marginBottom:10
    }
}

export default withApollo(RegisterOtherAtt)
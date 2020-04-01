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
    ApolloConsumer
} from "react-apollo"
import PropTypes from "prop-types"
import {
    setting_up_the_user,
    validate_three_words,
    validate_age
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

// importing navigation routes
import {  
    navigation_push_to_screen,
    navigation_set_root_one_screen
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
                error_text:"Minimum age is 10"
            },
            three_words:{
                value:"",
                error:false,
                error_text:"We know words aren't enough to describe you because you are unique! But a short description can be a good conversation starter and don't worry you can always change it later."
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
            avatar_img_obj:{}
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

        //validating three words
        if (!validate_three_words(this.state.three_words.value)){
            all_inputs_valid = false
            new_input_objects.three_words = {...this.state.three_words, error:true}
        }

        //validating age
        if (!validate_age(this.state.age.value)){
            all_inputs_valid = false
            new_input_objects.age = {...this.state.age, error:true}
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

    register_user = () => {
        //validate the input

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

    setting_up_the_user = async(user_data, apollo_client) => {
        await setting_up_the_user(user_data, apollo_client)
        
        //routing to the explore rooms screen
        navigation_set_root_one_screen({screen_name:EXPLORE_ROOMS_SCREEN})
    }

    get_img_object = (img_obj) => {
        this.setState({
            avatar_img_obj:img_obj
        })
    }

    render(){
        return(
            <ApolloConsumer>
                {
                    client=>{
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
                
                                                    <Mutation
                                                        mutation={REGISTER_USER}
                                                    >
                                                        {(register_user, {data})=>{
                            
                                                            if (data){
                                                                this.setting_up_the_user(data.register_user, client)
                                                            }
                        
                                                            return(
                                                                <View style={styles.input_box}>
                                                                    <BigButton
                                                                        button_text={"Register"}
                                                                        onPress={async()=>{
                                                                            
                                                                            //validate the input
                                                                            if(!this.validate_the_input()){
                                                                                return
                                                                            }

                                                                            //generating register_user query variables
                                                                            let register_user_variables = {                                                                        
                                                                                    email:this.props.email.trim(),
                                                                                    password:this.props.password.trim(),
                                                                                    username:this.props.username.trim(),
                            
                                                                                    age:parseInt(this.state.age.value),
                                                                                    name:this.state.name.value.trim(), 
                                                                                    three_words:this.state.three_words.value.trim(),
                                                                                    bio:this.state.bio.value.trim(),                                                                                
                                                                                }

                                                                            //checking whether the user has uploaded a default picture
                                                                            if (Object.keys(this.state.avatar_img_obj).length>0){
                                                                                                                                                                                                                                                                
                                                                                try{
                                                                                    const presigned_upload_url = await get_presigned_url(client, this.state.avatar_img_obj.file_name, this.state.avatar_img_obj.file_mime)
                                                                                    await upload_image_to_s3(presigned_upload_url, this.state.avatar_img_obj.image_data, this.state.avatar_img_obj.file_mime)                                
                                                                                }catch(e){
                                                                                    console.log(e)
                                                                                }

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
                                                                            console.log(register_user_variables,"dawdadadada")
                                                                            register_user({variables:register_user_variables})
                                                                        }}
                                                                    />  
                                                                </View>
                                                            )
                            
                                                        }}
                                                    </Mutation>                           
                                    </View>
                                </ScrollView>
                            </TouchableWithoutFeedback>                    
                        )
                    }
                }
            </ApolloConsumer>
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

export default RegisterOtherAtt
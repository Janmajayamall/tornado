import React from "react"
import { 
    View,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView
} from "react-native";
import {
    Mutation,
    ApolloConsumer
} from "react-apollo"
import { 
    setting_up_the_user,
    validate_login_email,
    validate_login_password,
    setting_up_jwt_token
 } from "../../helpers/index";

//importing base style 
import base_style from "../../styles/base"

//importing graphql queries
import {REGISTER_USER, LOGIN_USER} from "../../apollo_client/apollo_queries/index"
import base from "../../styles/base";

//import custom components
import BigTextInput from "../../custom_components/text_inputs/big_input_text"
import BigButton from "../../custom_components/buttons/big_buttons"

// importing screens
import {
    LOGIN_SCREEN,
    FEED_SCREEN,
    REGISTER_SCREEN
} from "../../navigation/screens"
import {
    navigation_set_root_two_bottoms_tabs,
    navigation_set_root_one_screen
} from "../../navigation/navigation_routes/index"



class ResetPassword extends React.PureComponent{

    constructor(props){
        super(props)

        this.state = {
            email:{
                value:"",
                error:false,
                error_text:"Please enter a valid email ID"
            },
            password:{
                value:"",
                error:false,
                error_text:"Please enter a valid password"
            },

            //keyboard safe
            main_container_bottom_padding:0
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

        //validating email
        let email_validation = validate_login_email(this.state.email.value)
        if(!email_validation.valid){
            all_inputs_valid=false
            new_input_objects.email={
                ...this.state.email,
                error:true, 
                error_text:email_validation.error_text
            }
        }else{
            new_input_objects.email={
                ...this.state.email,
                error:false
            }
        }

        //validating password
        let password_validation = validate_login_password(this.state.password.value)
        if(!password_validation.valid){
            all_inputs_valid=false
            new_input_objects.password={
                ...this.state.password,
                error:true, 
                error_text:password_validation.error_text
            }
        }else{
            new_input_objects.password={
                ...this.state.password,
                error:false
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


    change_email_id = (val) => {
        this.setState({
            email:{
                ...this.state.email,
                value:val
            }
        })
    }

    change_password = (val) => {
        this.setState({
            password:{
                ...this.state.password,
                value:val
            }
        })
    }

    setting_up_the_user = async(user_data) => {

        await setting_up_jwt_token(user_data.jwt)

        //routing bottom tab screens
        navigation_set_root_two_bottoms_tabs()
        return
    }
    
    navigate_to_register = () => {
        navigation_set_root_one_screen({
            screen_name:REGISTER_SCREEN
        })
    }

    render(){
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
                        <BigTextInput
                            placeholder={"Email Address"}
                            type="EMAIL"
                            value={this.state.email.value}
                            onChangeText={this.change_email_id}
                            error_state={this.state.email.error}
                            error_text={this.state.email.error_text}
                        />
                    </View>
                    <View style={styles.input_box}>
                        <BigTextInput
                            placeholder={"Password"}
                            type="PASSWORD"
                            value={this.state.password.value}
                            onChangeText={this.change_password}
                            error_state={this.state.password.error}
                            error_text={this.state.password.error_text}
                        />
                    </View>
                    <View style={styles.input_box}>
                        <Mutation
                            mutation={LOGIN_USER}
                        >
                            {(login_user, {data, error})=>{

                                console.log(error)

                                //after authenticating the user
                                if (data){
                                    console.log("Logged in")
                                    this.setting_up_the_user(data.login_user)
                                }

                                return(
                                    <BigButton
                                        button_text={"Login"}
                                        onPress={()=>{
                                            //validate the input
                                            if(!this.validate_the_input()){
                                                return
                                            }

                                            login_user({
                                                variables:{
                                                    email:this.state.email.value.trim(),
                                                    password:this.state.password.value.trim()
                                                }
                                            })                                            
                                        }}
                                        active={true}
                                    />
                                )
                            }}
                        </Mutation>                           
                    </View>
                    <Text 
                        style={base_style.typography.small_font}
                        onPress={this.navigate_to_register}
                    >
                        Don't have an account?
                    </Text>
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

export default ResetPassword
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
    ApolloConsumer,
    withApollo
} from "react-apollo"
import { 
    validate_login_password, 
    validate_login_email,
 } from "../../helpers/index";

//importing base style 
import base_style from "../../styles/base"

//importing graphql queries
import {
    PASSWORD_RECOVERY_CODE_VERIFICATION,
    PASSWORD_RECOVERY_SEND_CODE
} from "../../apollo_client/apollo_queries/index"

//import custom components
import BigTextInput from "../../custom_components/text_inputs/big_input_text"
import BigButton from "../../custom_components/buttons/big_buttons"
import Loader from "./../../custom_components/loading/loading_component"

// importing screens
import { LOGIN_SCREEN, REGISTER_SCREEN } from "../../navigation/screens"
import {
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
            verification_code:{
                value:"",
                error:false, 
                error_text:""
            },

            //screen state EMAIL or VERIFICATION_PASSWORD
            screen_state:"VERIFICATION_PASSWORD",

            //keyboard safe
            main_container_bottom_padding:0,

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

    request_code_email = async() => {
        //if loading state is true, return 
        if(this.state.loading){
            return
        }

        //make loading state true
        this.setState({
            loading:true
        })

        //validate the email
        const email_validation = validate_login_email(this.state.email.value)
        if(!email_validation.valid){
            this.setState((prev_state)=> {
                return({
                    email:{
                        ...prev_state.email,
                        error:true,
                        error_text:email_validation.error_text
                    },
                    loading:false //make loading state false, and no ned to execute further
                })
            })
            return 
        }

        //call password_recovery_send_code query to send verification code to the email id
        try{
            const {data} = await this.props.client.query({
                query:PASSWORD_RECOVERY_SEND_CODE,
                variables:{
                    email:this.state.email.value.trim()
                },
                fetchPolicy:"no-cache"
            })
            console.log(data)
            //checking if query was successful 
            if(data.password_recovery_send_code){
                this.setState({
                    loading:false, 
                    screen_state:"VERIFICATION_PASSWORD" //change the state of screen
                })
            }else{
                //query return false
                this.setState((prev_state)=>{
                    return({
                        email:{
                            ...prev_state.email,
                            error:true,
                            error_text:"User with this email does not exists"
                        },
                        loading:false
                    })
                })
            }
        }catch(e){
            console.log(e, "reset_password_screen.js | screen_state:EMAIL")
            //TODO: set error_state to true
        }
    }

    change_password_request = async() => {

        //if loading state is true, return 
        if(this.state.loading){
            return
        }

        this.setState({
            loading:true
        })

        let new_input_objects = {}
        let all_inputs_valid = true

        //validating verification code
        if(this.state.verification_code.value.trim().length===0){
            all_inputs_valid = false
            new_input_objects.verification_code={
                ...this.state.verification_code,
                error:true,
                error_text:"Please enter verification code"
            }
        }else{
            new_input_objects.verification_code={
                ...this.state.verification_code,
                error:false
            }
        }

        //validating password
        const password_validation = validate_login_password(this.state.password.value)
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

        //checking whether inputs are validated or not
        if(!all_inputs_valid){
            this.setState({
                verification_code:new_input_objects.verification_code,
                password:new_input_objects.password,
                loading:false //set loading state to false, so that user can fix the mistake
            })            
            return // not need to process further        
        }

        //call password_recovery_code_verification mutation 
        const {data} = await this.props.client.mutate({
            mutation:PASSWORD_RECOVERY_CODE_VERIFICATION,
            variables:{
                verification_code:this.state.verification_code.value.trim(),
                password:this.state.password.value.trim()
            }
        })

        //check password_recovery_code_verification response
        if(data.password_recovery_code_verification){
            //TODO: signal the user that password has been changed
            console.log("Password changed")
            this.navigate_to_login()
        }else{
            //signal the user that verification has not been successful 
            this.setState((prev_state)=>{
                return({
                    verification_code:{
                        ...prev_state.verification_code,
                        error:true,
                        error_text:"Verification code not valid"
                    },
                    loading:false 
                })
            })
            return
        }
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

    change_verification_code = (val) => {
        this.setState({
            verification_code:{
                ...this.state.verification_code,
                value:val
            }
        })
    }
    
    navigate_to_login = () => {
        navigation_set_root_one_screen({
            screen_name:LOGIN_SCREEN
        })
    }

    navigate_to_register = () => {
        navigation_set_root_one_screen({
            screen_name:REGISTER_SCREEN
        })
    }

    switch_to_email = () => {
        //set screen_state to EMAIL & loading:false & other state values empty
        this.setState({
            email:{
                value:"",
                error:false, 
                error_text:""
            },
            verification_code:{
                value:"",
                error:false,
                error_text:""
            },
            password:{
                value:"",
                error:false,
                error_text:""
            },
            loading:false,
            screen_state:"EMAIL"
        })
    }

    render(){

        //if loading is true
        if(this.state.loading){
            return(
                <View
                    style={[styles.main_container, {flex:1}]}
                >
                    <Loader/>
                </View>
            )
        }

        //if screen_state is EMAIL
        if(this.state.screen_state==="EMAIL"){
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
                            <Text 
                                style={[base_style.typography.medium_font, {padding:10, alignSelf:"flex-start"}]}
                            >
                                Password recovery
                            </Text>
                        </View>
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
                        <View
                            style={styles.input_box}
                        >
                            <BigButton
                                button_text={"Receive verification code on email"}
                                onPress={this.request_code_email}
                                active={true}
                            />
                        </View> 
                        <Text 
                            style={[base_style.typography.small_font, {padding:10}]}
                            onPress={this.navigate_to_login}
                        >
                            Already have an account?
                        </Text>                      
                    </ScrollView>
                </TouchableWithoutFeedback>

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
                        <Text 
                            style={[base_style.typography.medium_font, {padding:10, alignSelf:"flex-start"}]}
                        >
                            Change Password
                        </Text>
                    </View>
                    <View style={styles.input_box}>
                            <Text 
                                style={[base_style.typography.small_font, {padding:10, alignSelf:"flex-start"}]}
                            >
                                An email with verification code has been sent to your email ID
                            </Text>
                    </View>
                    <View style={styles.input_box}>
                        <BigTextInput
                            placeholder={"Verification Code"}
                            type="NUMBER"
                            value={this.state.verification_code.value}
                            onChangeText={this.change_verification_code}
                            error_state={this.state.verification_code.error}
                            error_text={this.state.verification_code.error_text}
                        />
                    </View>
                    <View style={styles.input_box}>
                        <BigTextInput
                            placeholder={"New Password"}
                            type="PASSWORD"
                            value={this.state.password.value}
                            onChangeText={this.change_password}
                            error_state={this.state.password.error}
                            error_text={this.state.password.error_text}
                        />
                    </View>
                    <View
                        style={styles.input_box}
                    >
                        <BigButton
                            button_text={"Update password"}
                            onPress={this.change_password_request}
                            active={true}
                        />
                    </View>
                    <Text 
                        style={[base_style.typography.small_font, {padding:10}]}
                        onPress={this.switch_to_email}
                    >
                        Change email?
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

export default withApollo(ResetPassword)

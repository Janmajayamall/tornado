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
import {Navigation} from "react-native-navigation"
import { 
    setting_up_the_user,
    validate_email,
    validate_password
 } from "./../../helpers/index";

//importing base style 
import base_style from "./../../styles/base"

//importing graphql queries
import {REGISTER_USER, LOGIN_USER} from "./../../apollo_client/apollo_queries/index"
import base from "./../../styles/base";

//import custom components
import BigTextInput from "./../../custom_components/text_inputs/big_input_text"
import BigButton from "./../../custom_components/buttons/big_buttons"

// importing screens
import {
    LOGIN_SCREEN,
    FEED_SCREEN
} from "./../../navigation/screens"



class Login extends React.PureComponent{

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
        if (!validate_email(this.state.email.value)){
            all_inputs_valid = false
            new_input_objects.email = {...this.state.email, error:true}
        }

        //validating password
        if (!validate_password(this.state.password.value)){
            all_inputs_valid = false
            new_input_objects.password = {...this.state.password, error:true}
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

    setting_up_the_user = async(user_data, apollo_client) => {

        await setting_up_the_user(user_data, apollo_client)

        //routing user to feed screen after authentication
        Navigation.setRoot({
            root: {
              stack: {
                children: [{
                  component: {
                    name: FEED_SCREEN,
                    options: {
                      topBar: {
                        visible: false,
                      },
                    }
                  }
                }]
              }
            }
          });
        
        return
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
                        <ApolloConsumer>
                            {
                                client => (
                                    <Mutation
                                        mutation={LOGIN_USER}
                                    >
                                        {(login_user, {data, error})=>{

                                            console.log(error)

                                            //after authenticating the user
                                            if (data){
                                                console.log("Logged in")
                                                this.setting_up_the_user(data.login_user, client)
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
                                                />
                                            )
                                        }}
                                    </Mutation>
                                )
                            }
                        </ApolloConsumer>                             
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

export default Login
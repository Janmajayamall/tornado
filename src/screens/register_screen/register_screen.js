import React from "react"
import { 
    View,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView
} from "react-native";
import {
    Mutation
} from "react-apollo"
import {Navigation} from "react-native-navigation"

//importing base style 
import base_style from "./../../styles/base"

//importing graphql queries


//import custom components
import BigTextInput from "./../../custom_components/text_inputs/big_input_text"
import BigButton from "./../../custom_components/buttons/big_buttons"

// importing screens
import {
    REGISTER_OTHER_ATT_SCREEN
} from "./../../navigation/screens"

//import input validators
import {
    validate_email,
    validate_password,
    validate_username
} from "./../../helpers/index"

// import navigation routes
import {  
    navigation_push_to_screen
} from "./../../navigation/navigation_routes/index";


class Register extends React.PureComponent{

    constructor(props){
        super(props)

        this.state = {
            email:{
                value:"",
                error:false,
                error_text:"Please enter a valid email ID"
            },
            username:{
                value:"",
                error:false,
                error_text:"Please enter username of length greater than 0 and less than 150 characters"
            },
            password:{
                value:"",
                error:false,
                error_text:"Please enter a password of length 8-50 characters"
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

        //validating username
        if (!validate_username(this.state.username.value)){
            all_inputs_valid = false
            new_input_objects.username = {...this.state.username, error:true}
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

    register_other_att = () => {

        //validate the input
        if (!this.validate_the_input()){
            return
        }

        navigation_push_to_screen(this.props.componentId, 
            { 
                screen_name:REGISTER_OTHER_ATT_SCREEN,
                props:{
                    email:this.state.email.value,
                    password:this.state.password.value,
                    username:this.state.username.value,    
                }
            }
        )
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

    change_username = (val) => {
        this.setState({
            username:{
                ...this.state.username,
                value:val
            }
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
                        <BigButton
                            button_text={"Next"}
                            onPress={this.register_other_att}
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

export default Register
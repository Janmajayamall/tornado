import React from "react"
import { 
    View,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    Alert
} from "react-native";
import {
    Mutation, 
    withApollo
} from "react-apollo"
import {Navigation} from "react-native-navigation"

//importing base style 
import base_style from "./../../styles/base"

//importing graphql queries
import {  

} from "./../../apollo_client/apollo_queries/index";

//import custom components
import BigTextInput from "./../../custom_components/text_inputs/big_input_text"
import BigButton from "./../../custom_components/buttons/big_buttons"
import Loader from "./../../custom_components/loading/loading_component"

// importing screens
import {
    REGISTER_OTHER_ATT_SCREEN, LOGIN_SCREEN
} from "./../../navigation/screens"

//import input validators
import {
    validate_email,
    validate_password,
    validate_username
} from "./../../helpers/index"

// import navigation routes
import {  
    navigation_push_to_screen,
    navigation_set_root_one_screen
} from "./../../navigation/navigation_routes/index";


class Register extends React.PureComponent{

    constructor(props){
        super(props)

        this.state = {
            email:{
                value:"",
                error:false,
                error_text:""
            },
            username:{
                value:"",
                error:false,
                error_text:""
            },
            password:{
                value:"",
                error:false,
                error_text:""
            },

            //keyboard safe
            main_container_bottom_padding:0,

            //loading state
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

    validate_the_input = async() =>{

        let all_inputs_valid = true

        let new_input_objects = {}

        //validate password
        let password_validation = validate_password(this.state.password.value)
    
        if (!password_validation.valid){
            all_inputs_valid=false
            new_input_objects.password = {
                ...this.state.password,
                error:true, 
                error_text:password_validation.error_text
            }
        }else{
            new_input_objects.password = {
                ...this.state.password,
                error:false, 
            }
        }

        //validating email
        let email_validation = await validate_email(this.state.email.value, this.props.client)
        if (!email_validation.valid){
            all_inputs_valid=false
            new_input_objects.email={
                ...this.state.email,
                error:true, 
                error_text:email_validation.error_text
            }
        }else{
            new_input_objects.email={
                ...this.state.email,
                error:false, 
            }
        }

        //validating username
        let username_validation = await validate_username(this.state.username.value, this.props.client)
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

    register_other_att = async() => {

        //if loading state is true, then return.
        if(this.state.loading){
            return
        }
        // otherwise change loading state to true
        this.setState({loading:true})

        //validate the input
        try{
            let validation_result = await this.validate_the_input()
            if (!validation_result){
                this.setState({loading:false})
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

            this.setState({loading:false})
            return

        }catch(e){
            
            Alert.alert(
                "Sorry",
                "Registration Failed",
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
    }

    change_email_id = async(val) => {
        this.setState({
            email:{
                ...this.state.email,
                value:val.toLowerCase().trim()
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
        
        if(val===" "){
            return
        }

        this.setState({
            username:{
                ...this.state.username,
                value:val.toLowerCase().trim()
            }
        })
    }

    navigate_to_login = () => {
        navigation_set_root_one_screen({
            screen_name:LOGIN_SCREEN
        })
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
                            onPress={()=>{this.register_other_att()}}
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

export default withApollo(Register)
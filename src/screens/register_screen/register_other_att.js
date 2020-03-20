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
import PropTypes from "prop-types"
import {
    setting_up_the_user
} from "./../../helpers"

//importing base style 
import base_style from "./../../styles/base"

//importing graphql queries
import {REGISTER_USER} from "./queries/index"
import base from "./../../styles/base";

//import custom components
import BigTextInput from "./../../custom_components/text_inputs/big_input_text"
import BigButton from "./../../custom_components/buttons/big_buttons"

//import input validators
import {
    validate_three_words,
    validate_age
} from "./helpers/validators"

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
        console.log(new_input_objects,)
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
                        <ApolloConsumer>
                            {
                                client => (
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
                                                        onPress={()=>{
                                                            //validate the input
                                                            if(!this.validate_the_input()){
                                                                return
                                                            }
                                                
                                                            register_user({
                                                                variables:{
                                                                    email:this.props.email.trim(),
                                                                    password:this.props.password.trim(),
                                                                    username:this.props.username.trim(),
            
                                                                    age:parseInt(this.state.age.value),
                                                                    name:this.state.name.value.trim(), 
                                                                    three_words:this.state.three_words.value.trim(),
                                                                    bio:this.state.bio.value.trim()
                                                            }})
                                                        }}
                                                    />  
                                                </View>
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

export default RegisterOtherAtt
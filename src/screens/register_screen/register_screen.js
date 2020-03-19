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

//importing base style 
import base_style from "./../../styles/base"

//importing graphql queries
import {REGISTER_USER} from "./queries/index"
import base from "./../../styles/base";

//import custom components
import BigTextInput from "./../../custom_components/text_inputs/big_input_text"

class Register extends React.PureComponent{
    constructor(props){
        super(props)

        this.state = {
            email:"",
            name:"",
            username:"",
            password:"",
            three_words:"",
            age:"",
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
                            value={this.state.email}
                            onChangeText={(val)=>{this.setState({email:val})}}
                        />
                    </View>
                    <View style={styles.input_box}>
                        <BigTextInput
                            placeholder={"What your friends call you?"}
                            type="TEXT"
                            value={this.state.name}
                            onChangeText={(val)=>{this.setState({name:val})}}
                        />
                    </View>
                    <View style={styles.input_box}>
                        <BigTextInput
                            placeholder={"Whats your go to cool name?"}
                            type="TEXT"
                            value={this.state.username}
                            onChangeText={(val)=>{this.setState({username:val})}}
                        />
                    </View>
                    <View style={styles.input_box}>
                        <BigTextInput
                            placeholder={"Password"}
                            type="PASSWORD"
                            value={this.state.password}
                            onChangeText={(val)=>{this.setState({password:val})}}
                        />
                    </View>
                    <View style={styles.input_box}>
                        <BigTextInput
                            placeholder={"Describe yourself in 3 or less words"}
                            type="TEXT"
                            value={this.state.three_words}
                            onChangeText={(val)=>{this.setState({three_words:val})}}
                        />
                    </View>
                    <View style={styles.input_box}>
                        <BigTextInput
                            placeholder={"Your age?"}
                            type="NUMBER"
                            value={this.state.age}
                            onChangeText={(val)=>{this.setState({age:val})}}
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
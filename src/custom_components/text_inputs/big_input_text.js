import React from "react"
import { 
    View, 
    TextInput ,
    Text  
} from "react-native";
import base_style from "../../styles/base";

class BigTextInput extends React.PureComponent {



    constructor(props){
        super(props)
        this.state={

        }
    }

    generate_input_box = () => {
        if (this.props.type==="TEXT"){
            return(
                <TextInput
                    placeholder={this.props.placeholder}
                    value={this.props.value}
                    onChangeText={this.props.onChangeText}
                    style={styles.input_box}
                    placeholderTextColor={"white"}
                />
            )
        }else if(this.props.type==="PHONE"){
            return(
                <TextInput
                    placeholder={this.props.placeholder}
                    value={this.props.value}
                    onChangeText={this.props.onChangeText}
                    keyboardType={"phone-pad"}
                    style={styles.input_box}
                    placeholderTextColor={"white"}
                />
            )
        }else if(this.props.type==="EMAIL"){
            return(
                <TextInput
                    placeholder={this.props.placeholder}
                    value={this.props.value}
                    onChangeText={this.props.onChangeText}
                    keyboardType={"email-address"}
                    style={styles.input_box}
                    placeholderTextColor={"white"}
                />
            )
        }else if(this.props.type==="PASSWORD"){
            return(
                <TextInput
                    placeholder={this.props.placeholder}
                    value={this.props.value}
                    onChangeText={this.props.onChangeText}
                    secureTextEntry={true}
                    style={styles.input_box}
                    placeholderTextColor={"white"}
                />
            )
        }else if(this.props.type==="NUMBER"){
            return(
                <TextInput
                    placeholder={this.props.placeholder}
                    value={this.props.value}
                    onChangeText={this.props.onChangeText}
                    keyboardType={"number-pad"}
                    style={styles.input_box}
                    placeholderTextColor={"white"}
                />
            )
        }

    }

    render(){
        return(
            <View style={styles.main_container}>
                {this.generate_input_box()}
                {
                    this.props.error_state ? 
                    <View style={styles.error_view}>
                        <Text style={styles.error_text}>
                            {this.props.error_text}
                        </Text>
                    </View>:
                    undefined
                }                
            </View>
        )
    }

}

const styles = {
    main_container:{
        width:"100%",

    },
    input_box:{
        ...base_style.typography.small_font,
        padding:15,
        backgroundColor:base_style.color.primary_color_lighter,
        borderRadius:5,
    },
    error_view:{
        paddingTop:2
    },
    error_text:{
        ...base_style.typography.mini_font
    }
}

export default BigTextInput
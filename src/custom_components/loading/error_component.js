import React from "react"
import {  
    View,
    StyleSheet,
    ActivityIndicator,
    Text
} from "react-native";
import PropTypes from "prop-types"

//import custom components
import BigButton from "./../buttons/big_buttons"

//base style
import base_style from "./../../styles/base"


class ErrorComponent extends React.PureComponent{

    static propTypes = {
        retry:PropTypes.func
    }

    constructor(props){
        super(props)

        this.state = {

        }
    }

    render(){
        return(
            <View style={styles.main_container}>
                <Text style={styles.text_style}>
                    Sorry
                </Text>     
                <Text style={styles.text_style}>
                    something went wrong!
                </Text>  
                <View style={styles.button_view}>
                    <BigButton
                        button_text="Try Again"
                        onPress={this.props.retry}
                    />
                </View> 

            </View>                                          
        )
    }

}

export default ErrorComponent

const styles = StyleSheet.create({
    main_container:{
        flex:1,
        width:"100%",
        justifyContent:"center",
        alignItems:"center"
    },
    text_style:{
        ...base_style.typography.medium_font,
        ...base_style.typography.font_colors.low_emphasis, 
        fontSize:30
    },
    button_view:{
        width:"80%",
        alignItems:"center",
        marginTop:10
    }
})
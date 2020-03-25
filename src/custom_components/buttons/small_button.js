
import React from "react"
import { 
    View, 
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet  
} from "react-native";
import PropTypes from "prop-types"

import base_style from "../../styles/base";

class SmallButton extends React.PureComponent {

    static propTypes = {
        onPress:PropTypes.func,
        button_text:PropTypes.string,
        width:PropTypes.any,
    }

    constructor(props){
        super(props)
        this.state={

        }
    }

    render(){
        return(
            <TouchableOpacity s
                style={[styles.main_container]}
                onPress={this.props.onPress}
            >
                <Text
                    style={styles.button_text}
                >
                    {this.props.button_text}
                </Text>
            </TouchableOpacity>
        )
    }

}

const styles = StyleSheet.create({
    main_container:{
        backgroundColor:base_style.color.primary_color,
        borderColor:base_style.color.primary_color_lighter,
        padding:5,
        flexWrap:"wrap"
    },
    button_text:{
        ...base_style.typography.small_header
    }
})

export default SmallButton
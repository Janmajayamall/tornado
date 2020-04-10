
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
            <TouchableOpacity 
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
        flexWrap:"wrap",        
        backgroundColor:base_style.color.icon_selected,
        padding:5
    },
    button_text:{
        ...base_style.typography.small_font,
        color:"black",
        // textDecorationLine:"underline",
        // fontStyle:"italic"
    }
})

export default SmallButton
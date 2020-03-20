
import React from "react"
import { 
    View, 
    TextInput,
    TouchableOpacity,
    Text  
} from "react-native";
import PropTypes from "prop-types"

import base_style from "../../styles/base";

class BigButton extends React.PureComponent {

    static propTypes = {
        onPress:PropTypes.func,
        button_text:PropTypes.string
    }

    constructor(props){
        super(props)
        this.state={

        }
    }

    render(){
        return(
            <TouchableOpacity 
                style={styles.main_container}
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

const styles = {
    main_container:{
        width:"100%",
        backgroundColor:base_style.color.primary_color_lighter
    },
    button_text:{
        ...base_style.typography.small_font,
    }
}

export default BigButton

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
        button_text:PropTypes.string,

        // button effect
        active:PropTypes.bool
    }

    constructor(props){
        super(props)
        this.state={

        }
    }

    render(){
        return(
            <TouchableOpacity 
                style={this.props.active ?
                        [styles.main_container, {
                            backgroundColor:base_style.color.icon_selected,
                        }] :
                        [styles.main_container, {
                            backgroundColor:base_style.color.icon_not_selected,                                       
                        }] 
                    }           
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
        padding:10,
        justifyContent:"center",
        alignItems:"center"
    },
    button_text:{
        ...base_style.typography.small_font,
        color:base_style.color.primary_color
    }
}

export default BigButton
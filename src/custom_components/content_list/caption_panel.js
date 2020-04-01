import React from "react"
import {  
    View,
    StyleSheet
} from "react-native";
import PropTypes from "prop-types"

//importing components
import AvatarTextPanel from "./../user_attributes/avatar_text_panel"
import { constants } from "../../helpers";

class CaptionPanel extends React.PureComponent{

    static propTypes = {
        caption_object:PropTypes.any,
        caption_index:PropTypes.any
    }

    constructor(props){
        super(props)

        this.state = {

        }
    }

    render(){
        return(
            <View style={styles.main_container}>
                <AvatarTextPanel
                    user_object={this.props.caption_object.creator_info}
                    panel_type={constants.avatar_text_panel_type.caption}
                    caption_object={this.props.caption_object}
                    caption_index={this.props.caption_index}
                    feed_screen_caption={true}
                />            
            </View>                                          
        )
    }

}

export default CaptionPanel

const styles = StyleSheet.create({
    main_container:{
        borderLeftColor:"white",
        borderLeftWidth:2
    }
})
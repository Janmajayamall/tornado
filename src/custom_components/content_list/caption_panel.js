import React from "react"
import {  
    View,
    StyleSheet
} from "react-native";
import PropTypes from "prop-types"

//importing components
import AvatarTextPanel from "./../user_attributes/avatar_text_panel"

class CaptionPanel extends React.PureComponent{

    static propTypes = {
        caption_object:PropTypes.any
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
                    avatar={this.props.caption_object.creator_info.avatar}
                    default_avatar={this.props.caption_object.creator_info.default_avatar}
                    username={this.props.caption_object.creator_info.username}
                    description={`${this.props.caption_object.description}. \n this is a very new thing, \n and I think that people want it`}
                    is_description={true}
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
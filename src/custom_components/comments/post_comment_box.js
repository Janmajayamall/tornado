import React from "react"
import {
    View,
    TextInput,
    Text

} from "react-native"

import base_style from "./../../styles/base"

//importing custom components
import Avatar from "./../image/profile_image"

class PostCommentPanel extends React.PureComponent {

    constructor(props){

        super(props)
        this.state = {

        }

    }

    componentDidUpdate(){
        console.log("rendered: PostCommentPanel",)
    }

    render(){
        return(
            <View
                style={styles.main_container}
            >
                <View style={styles.avatar_container}>
                    <Avatar
                        source={this.props.avatar}
                    />
                </View>
                <View style={styles.input_text_parent_container}>
                    <View style={styles.input_text_container}>
                        <TextInput/>
                    </View>
                    <View style={styles.post_button_container}>
                        <Text>Post</Text>
                    </View>
                </View>
            </View>
        )
    }

}

const styles = {
    main_container:{
        back:base_style.color.primary_color,
        width:"100%",
        flexDirection:"row"
    },
    avatar_container:{
        width:"20%",
    },
}

export default PostCommentPanel
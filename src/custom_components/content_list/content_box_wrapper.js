import React from "react"
import { 
    View
 } from "react-native";
 import {Navigation} from "react-native-navigation"
 import {COMMENT_SCREEN} from "./../../navigation/screens"

 // importing custom components

class ContentBoxWrapper extends React.PureComponent{

    constructor(props){
        super(props)
        this.state={

        }
    }

    navigate_to_comment_screen = () => {
        console.log(this.props.componentId, "content_box_wrapper.js")
        Navigation.push(this.props.componentId, {
            component: {
                name: COMMENT_SCREEN,
                passProps: {
                    post_object:this.props.post_object,
                    content_box:this.props.content_box
                },
                options: {

                },
                topBar:{
                    leftButtons: [
                        {
                            id: 'back',
                            icon: {
                                uri: 'back',
                            },
                        },
                    ],
                }
            }
        });
    }

    render(){
        return(
            this.props.content_box
        )
    }
    
}

export default ContentBoxWrapper
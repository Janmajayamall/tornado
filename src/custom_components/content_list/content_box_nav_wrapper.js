import React from "react"
import { 
    View
 } from "react-native";

 // importing custom components
 import ContentBox from "./content_box"
 import ContentBoxWrapper from "./content_box_wrapper"

class ContentBoxNavWrapper extends React.PureComponent{

    constructor(props){
        super(props)
        this.state={

        }
        this.content_box_wrapper_ref = React.createRef()
    }

    navigate_to_comment_screen = () =>{
        console.log(this.content_box_wrapper_ref)
        this.content_box_wrapper_ref.current.navigate_to_comment_screen()
    }

    generate_content_box = () => {
        return(
            <ContentBox
                post_object={this.props.object.item}
                on_feed={true}
                navigate_to_comment_screen={this.navigate_to_comment_screen}
                index={this.props.object.index}
            />
        )
    }

    render(){
        return(
            <ContentBoxWrapper
                content_box={this.generate_content_box()}
                ref={this.content_box_wrapper_ref}
                componentId={this.props.componentId}
                post_object={this.props.object.item}

            />
        )
    }
    
}

export default ContentBoxNavWrapper
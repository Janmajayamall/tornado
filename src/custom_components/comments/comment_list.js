import React from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Dimensions,
    FlatList
} from 'react-native'
import PropTypes from 'prop-types'

//custom components
import CommentDisplay from "./comment_display"
import AvatarTextPanel from "./../user_attributes/avatar_text_panel"
import ContentBox from "./../content_list/content_box"


class CommentList extends React.PureComponent{

    static propTypes = {
        comment_list:PropTypes.array,
        loading:PropTypes.any,
        error:PropTypes.any
    }

    constructor(props){
        super(props)
        this.state={
        }
    }

    componentDidUpdate(){
        // console.log("rendered: ContentList" )
    }

    render_item = (object) => {
        console.log(object.item)
        if (object.index===0){
            return(
                <ContentBox
                    post_object={object.item}
                    on_feed={false}
                />
            )
        }

        return(
            <AvatarTextPanel
                avatar={object.item.creator_info.avatar}
                username={object.item.creator_info.username}
                description={object.item.comment_body}
            />
        )

    }

    render(){

        if (this.props.loading){
            return(
                <Text>
                    Loading....
                </Text>
            )
        }

    
        if (this.props.error){
            return(
                <Text>
                    Loadssssing....
                </Text>
            )
        }
    
        return(
            <FlatList
                data={[this.props.post_object, ...this.props.comment_list]}
                renderItem={(object)=>this.render_item(object)}
            />      
        )
    }

}

const styles = StyleSheet.create({

})

export default CommentList

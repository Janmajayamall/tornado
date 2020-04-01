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
import AvatarTextPanel from "./../user_attributes/avatar_text_panel"
import ContentBox from "./../content_list/content_box"
import ContentCaptionBox from "./../content_list/content_caption_box"


//importing helpers
import {
    constants
} from "./../../helpers/index"


class CommentList extends React.PureComponent{

    static propTypes = {
        comment_list:PropTypes.array,
        loading:PropTypes.any,
        error:PropTypes.any,
        refresh_list:PropTypes.func,
        bottom_padding:PropTypes.any,
        post_object:PropTypes.object,
        network_status:PropTypes.any,
        componentId:PropTypes.any,

        //for identifying avatar_text_panel type CAPTION or COMMENT
        query_type :PropTypes.object

    }

    constructor(props){
        super(props)
        this.state={
        }
    }

    componentDidUpdate(){
        // console.log("rendered: ContentList", this.props.bottom_padding)
    }

    render_item = (object) => {

        //rendering the header of the list (i.e. the post)
        if (object.index===0){
            //if query_type===CAPTION_QUERY
            if(this.props.query_type===constants.comment_list_query_type.caption_query){
                return(
                    <ContentCaptionBox
                        post_object={object.item}
                        on_feed={false}
                        componentId={this.props.componentId}//TODO: put in the componentId
                        avatar_navigate_user_profile={true}
                    />
                )
            }

            if(this.props.query_type===constants.comment_list_query_type.comment_query){
                return(
                    <ContentBox
                        post_object={object.item}
                        on_feed={false}
                        componentId={this.props.componentId}//TODO: put in the componentId
                        avatar_navigate_user_profile={true} 
                    />
                )    
            }

            return(
                <Text>
                    Error in the header post of the comment list
                </Text>
            )
                    
        }

        if(this.props.query_type===constants.comment_list_query_type.caption_query){
            return(
                <AvatarTextPanel
                    user_object={object.item.creator_info}
                    caption_object={object.item}
                    caption_index={object.index-1}
                    panel_type={constants.avatar_text_panel_type.caption}
                    feed_screen_caption={false}
                />
            )
        }
        
        if(this.props.query_type===constants.comment_list_query_type.comment_query){
            return(
                <AvatarTextPanel
                    user_object={object.item.creator_info}
                    panel_type={constants.avatar_text_panel_type.comment_display}
                    comment={object.item.comment_body}                
                />
            )
        }

        //TODO: make this a proper error
        return(
            <Text>
                ERRORRRR
            </Text>
        )
        
    }

    refresh_list = () => {
        this.setState({refreshing:true})
        this.props.refresh_list()
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
                onRefresh={this.refresh_list}
                refreshing={!this.props.network_status===7}
                contentContainerStyle={{paddingBottom:this.props.bottom_padding}}
            />      
        )
    }

}

const styles = StyleSheet.create({

})

export default CommentList

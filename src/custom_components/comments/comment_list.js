import React from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Dimensions,
    FlatList,
    RefreshControl
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
import ListItemDivider from '../common_decorators/list_item_divider'


class CommentList extends React.PureComponent{

    static propTypes = {
        comment_list:PropTypes.array,
        refetch:PropTypes.func,
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
        console.log("commentlist")
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
                    is_user={object.item.is_user}
                    avatar_navigate_user_profile={true}
                    componentId={this.props.componentId}
                />
            )
        }
        
        if(this.props.query_type===constants.comment_list_query_type.comment_query){
            return(
                <AvatarTextPanel
                    user_object={object.item.creator_info}
                    panel_type={constants.avatar_text_panel_type.comment_display}
                    comment_object={object.item}    
                    is_user={object.item.is_user}
                    avatar_navigate_user_profile={true}
                    componentId={this.props.componentId}
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

    render(){
    
        return(

            <FlatList
                data={[this.props.post_object, ...this.props.comment_list]}
                renderItem={(object)=>this.render_item(object)}                
                contentContainerStyle={{paddingBottom:this.props.bottom_padding}}    
                refreshControl={
                    <RefreshControl
                        onRefresh={()=>{this.props.refetch()}}
                        refreshing={this.props.network_status===constants.apollo_query.network_status.refetch}                        
                        progressBackgroundColor="#ffffff"
                        tintColor="#ffffff"
                    />
                }
                keyExtractor={item => item.id}
            />      
        )
    }

}

const styles = StyleSheet.create({

})

export default CommentList

// this.props.network_status===8
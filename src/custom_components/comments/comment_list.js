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
        toggle_post_like:PropTypes.func
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
        if (object.index===0){
            return(
                <ContentBox
                    post_object={object.item}
                    on_feed={false}
                    toggle_post_like={this.props.toggle_post_like}
                />
            )
        }

        return(
            <AvatarTextPanel
                user_object={object.item.creator_info}
                panel_type={constants.avatar_text_panel_type.comment_display}
                description={object.item.comment_body}                
            />
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

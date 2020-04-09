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
import ContentBox from "./content_box"
import ContentCaptionBox from "./content_caption_box"
import ListItemDivider from "./../../custom_components/common_decorators/list_item_divider"

//importing helpers
import {
    constants
} from "./../../helpers/index"


class ContentList extends React.PureComponent{

    static propTypes = {
        room_posts:PropTypes.array,
        componentId:PropTypes.any,
        on_load_more:PropTypes.func,
        header_display:PropTypes.bool,
        header_component:PropTypes.any,
        networkStatus:PropTypes.any,
        refetch:PropTypes.func, 

        //boolean whether avatar text panel for user is clickable or not
        avatar_navigate_user_profile:PropTypes.any
    }

    constructor(props){
        super(props)
        this.state={

        }
        
    }


    render_item_list = (object) => {

        if (this.props.header_display===true && object.index===0){
            return object.item 
        }

        //if post_type: room_caption_post
        if(object.item.post_type===constants.post_types.room_caption_post){
            console.log(this.props.header_display, object.item, "This is it")
            return (
                <ContentCaptionBox
                    post_object={object.item}
                    on_feed={true}
                    componentId={this.props.componentId}
                    avatar_navigate_user_profile={this.props.avatar_navigate_user_profile}
                />
            )
        }

        return(
            <ContentBox
                post_object={object.item}
                on_feed={true}
                componentId={this.props.componentId}
                avatar_navigate_user_profile={this.props.avatar_navigate_user_profile}
            />
        )
    }

    generate_data_for_list = () => {

        if (this.props.header_display===true){
            return[
                this.props.header_component,
                ...this.props.room_posts
            ]
        }else{
            return this.props.room_posts
        }

    }

    render(){
    
        return(
            <FlatList
                data={this.generate_data_for_list()}
                renderItem={this.render_item_list}
                onEndReached={this.props.on_load_more}
                onEndReachedThreshold={0.5}
                ItemSeparatorComponent={()=><ListItemDivider/>}
                refreshControl={
                    <RefreshControl
                        onRefresh={()=>{this.props.refetch()}}
                        refreshing={this.props.networkStatus===constants.apollo_query.network_status.refetch}                        
                        progressBackgroundColor="#ffffff"
                        tintColor="#ffffff"
                    />
                }
            />      
        )
    }

}

const styles = StyleSheet.create({

})

export default ContentList
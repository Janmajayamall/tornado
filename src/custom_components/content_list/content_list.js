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
import ContentBox from "./content_box"
import ContentCaptionBox from "./content_caption_box"


class ContentList extends React.PureComponent{

    static propTypes = {
        room_posts:PropTypes.array,
        loading:PropTypes.any,
        error:PropTypes.any,
        componentId:PropTypes.any,
        on_load_more:PropTypes.func,
        header_display:PropTypes.bool,
        header_component:PropTypes.any
    }

    constructor(props){
        super(props)
        this.state={

        }
        console.log(this.props)
    }

    render_item_list = (object) => {

        if (this.props.header_display===true && object.index===0){
            return object.item 
        }

        //if post_type: room_caption_post
        console.log(object.item.caption_objects, "dadw")
        if(object.item.caption_objects && object.item.caption_objects.length>0){
            return (
                <ContentCaptionBox
                    post_object={object.item}
                    on_feed={true}
                    componentId={this.props.componentId}
                />
            )
        }

        return(
            <ContentBox
                post_object={object.item}
                on_feed={true}
                componentId={this.props.componentId}
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
                data={this.generate_data_for_list()}
                renderItem={this.render_item_list}
                onEndReached={this.props.on_load_more}
                onEndReachedThreshold={0.5}
            />      
        )
    }

}

const styles = StyleSheet.create({

})

export default ContentList
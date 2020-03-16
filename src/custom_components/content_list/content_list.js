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


class ContentList extends React.PureComponent{

    static propTypes = {
        
    }

    constructor(props){
        super(props)
        this.state={

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
                data={this.props.room_posts}
                renderItem={(object)=>{
                    return(
                        <ContentBox
                            post_object={object.item}
                            on_feed={true}
                            componentId={this.props.componentId}
                        />
                    )
                }}
                onEndReached={this.props.on_load_more}
                onEndReachedThreshold={0.5}
            />      
        )
    }

}

const styles = StyleSheet.create({

})

export default ContentList
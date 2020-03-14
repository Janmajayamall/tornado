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

// const default_state = {
//     room_posts
// }

const content_list = (props) => {

    if (props.loading){
        return(
            <Text>
                Loading....
            </Text>
        )
    }

    if (props.error){
        return(
            <Text>
                Loadssssing....
            </Text>
        )
    }

    return(
        <FlatList
            data={props.room_posts}
            renderItem={(object)=>{
                return(
                    <ContentBox
                        post_object={object.item}
                    />
                )
            }}
            onEndReached={props.on_load_more}
            onEndReachedThreshold={0.5}
        />      
    )

}

const styles = StyleSheet.create({

})

export default content_list
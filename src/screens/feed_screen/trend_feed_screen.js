import React from 'react'
import { connect } from 'react-redux'
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    FlatList

} from 'react-native'
import base_style from './../../styles/base'
import gql from 'graphql-tag';
import {
    Query
} from 'react-apollo'
import { Navigation } from "react-native-navigation"

//importing queries/mutations in gql
import {
    GET_ROOM_FEED
} from "./../../apollo_client/apollo_queries/index"

//importing components 
import ContentList from "./../../custom_components/content_list/content_list"
import ContentBox from "./../../custom_components/content_list/content_box"
import ContentCaptionBox from "./../../custom_components/content_list/content_caption_box"
import Loader from "./../../custom_components/loading/loading_component"

//importing helpers & constants
import {
    constants
} from "./../../helpers/index"

//importing screens and navigation functions
import { navigation_push_to_screen } from '../../navigation/navigation_routes';
import {  
    COMMON_CREATE_POSTS_SCREEN,
    SEARCH_ROOMS_SCREEN
} from "./../../navigation/screens";




class TrendFeedScreen extends React.PureComponent {

    constructor(props){

        super(props)

        this.state={

        }

        //binding the topBar add post button 
        this.navigation_event_listener = Navigation.events().bindComponent(this);

    }

    componentWillUnmount(){
        this.navigation_event_listener.remove()
    }

    //react native navigation event binded function for action buttons
    navigationButtonPressed({ buttonId }) {
        if (buttonId===constants.navigation.action_buttons.SEARCH_ROOMS){
            navigation_push_to_screen(this.props.componentId,
                    {
                        screen_name:SEARCH_ROOMS_SCREEN,
                        options:{
                            topBar: {
                                visible:false
                            },
                        }
                    }
                )
        }

    }

    get_room_posts = () => {
    //    in-built pagination
    return(

        <Query 
            query={GET_ROOM_FEED}
            variables={{
                limit:constants.apollo_query.pagination_limit
            }}
        >
            {({ loading, error, data, fetchMore }) => {   
                
                if (data){
                    return(
                        <ContentList
                            componentId={this.props.componentId}
                            room_posts={data ? data.get_room_posts_user_id.room_posts : []}
                            on_load_more={()=>{
                                fetchMore({
                                    //getting more posts using cursor
                                    query:GET_ROOM_FEED,
                                    variables:{
                                        limit:constants.apollo_query.pagination_limit,
                                        room_post_cursor:data.get_room_posts_user_id.room_post_cursor
                                    },
                                    updateQuery: (previous_data, {fetchMoreResult}) => {
                                        //appending to the previous result 
    
                                        if (!previous_data.get_room_posts_user_id.next_page){
                                            return previous_data
                                        }
    
                                        const new_posts_arr = [
                                            ...previous_data.get_room_posts_user_id.room_posts,
                                            ...fetchMoreResult.get_room_posts_user_id.room_posts
                                        ]
    
                                        const new_data_object = {
                                            ...fetchMoreResult, 
                                            get_room_posts_user_id:{
                                                ...fetchMoreResult.get_room_posts_user_id,
                                                room_posts:new_posts_arr
                                            }
                                        }
    
                                        return new_data_object
                                        }
                                    })
                                }}
                            header_display={false}
                            header_component={undefined}  
                            avatar_navigate_user_profile={true}
                        />
                    )
                }

                return(
                    <Loader/>
                )

            }}
        </Query>

    )

    }


    render(){
        return(
            <View style={styles.main_container}>
                {
                    this.get_room_posts()
                }
            </View>
        )
    }

}

const styles = StyleSheet.create({

    main_container:{
        backgroundColor:base_style.color.primary_color,
        flex:1
    },

})



export default TrendFeedScreen

import React from 'react'
import { connect } from 'react-redux'
import {
    View,
    StyleSheet,
    Text,
    ScrollView

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

//importing helpers & constants
import {
    constants
} from "./../../helpers/index"

//importing screens and navigation functions
import { navigation_push_to_screen } from '../../navigation/navigation_routes';
import {  
    COMMON_CREATE_POSTS_SCREEN
} from "./../../navigation/screens";




class FeedScreen extends React.Component {

    constructor(props){

        super(props)

        this.state={

        }

        //binding the topBar add post button 
        Navigation.events().bindComponent(this);

    }

    //react native navigation event binded function for action buttons
    navigationButtonPressed({ buttonId }) {
        if (buttonId===constants.navigation.action_buttons.ADD_POST){
            navigation_push_to_screen(this.props.componentId,
                    {
                        screen_name:COMMON_CREATE_POSTS_SCREEN,
                        options:{
                            topBar: {
                                rightButtons: [
                                    {
                                        id: constants.navigation.action_buttons.SHARE_POST,
                                        text:"New Post"
                                    }
                                ]
                            }
                        },
                        props:{
                            
                        }
                    }
                )
        }

      }

    get_room_posts = () => {
    //    in-build pagination

    return(

        <Query 
            query={GET_ROOM_FEED}
            variables={{
                limit:5
            }}
        >
            {({ loading, error, data, fetchMore }) => {
                console.log(data,error, 'feed screen')
                return(
                    <ContentList
                        componentId={this.props.componentId}
                        loading={loading}
                        room_posts={data ? data.get_room_posts_user_id.room_posts : []}
                        on_load_more={()=>{
                            fetchMore({
                                //getting more posts using cursor
                                query:GET_ROOM_FEED,
                                variables:{
                                    limit:5,
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
                    />
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

const mapStateToProps = (state) => {
    return {
    }
}

const mapDisptachToProps = (dispatch) => {
    return {
    }
}


export default connect(mapStateToProps, mapDisptachToProps)(FeedScreen)
import React from "react"
import { 
    View,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView
} from "react-native";
import {
    Mutation,
    ApolloConsumer,
    Query
} from "react-apollo"
import {Navigation} from "react-native-navigation"
import {  
    FEED_SCREEN,
    PROFILE_SCREEN
} from "../../navigation/screens";
import {
    navigation_push_to_screen
} from "./../../navigation/navigation_routes/index"
import PropTypes from "prop-types"

//importing base style 
import base_style from "../../styles/base"

//importing custom components
import RoomDetailsPanel from "./components/room_details_panel"
import ContentList from "./../../custom_components/content_list/content_list"

//importing graphql queries
import { GET_ROOM_POSTS } from "../../apollo_client/apollo_queries/index";


class RoomDetails extends React.Component{

    static propTypes = {
        room_object:PropTypes.any
    }

    constructor(props){
        super(props)

        this.state = {
            selected_set:new Set(),
        }
    }

    navigate_to_creator_profile = (user_info) => {
        navigation_push_to_screen(this.props.componentId, {
            screen_name:PROFILE_SCREEN,
            props:{
                is_user:false,
                profile_user_info:user_info
            }
        })
    }

    render(){
        return(
            <ApolloConsumer>
                {
                    client => (
                        <SafeAreaView style={styles.main_container}> 
                            
                            <Query 
                                query={GET_ROOM_POSTS}
                                variables={{
                                    limit:5,
                                    room_id:this.props.room_object._id
                                }}
                            >
                                {({ loading, error, data, fetchMore }) => {
                                    console.log(error)
                                    if (error){
                                       return(<Text>Errrrooorr</Text>)
                                    }

                                    if(loading){
                                        return(<Text>Loading....</Text>)
                                    }
                                                                    
                                    return(
                                        <ContentList
                                            componentId={this.props.componentId}
                                            loading={loading}
                                            room_posts={data ? data.get_room_posts_room_id.room_posts : []}
                                            on_load_more={()=>{
                                                console.log(data, "this is here")
                                                fetchMore({
                                                    //getting more posts using cursor
                                                    query:GET_ROOM_POSTS,
                                                    variables:{
                                                        limit:5,
                                                        room_post_cursor:data.get_room_posts_room_id.room_post_cursor,
                                                        room_id:this.props.room_object._id
                                                    },
                                                    updateQuery: (previous_data, {fetchMoreResult}) => {
                                                        //appending to the previous result 

                                                        if (!previous_data.get_room_posts_room_id.next_page){
                                                            return previous_data
                                                        }


                                                        const new_posts_arr = [
                                                            ...previous_data.get_room_posts_room_id.room_posts,
                                                            ...fetchMoreResult.get_room_posts_room_id.room_posts
                                                        ]

                                                        const new_data_object = {
                                                            ...fetchMoreResult, 
                                                            get_room_posts_room_id:{
                                                                ...fetchMoreResult.get_room_posts_room_id,
                                                                room_posts:new_posts_arr
                                                            }
                                                        }

                                                        return new_data_object
                                                        }
                                                    })
                                                }}  
                                            header_display={true}
                                            header_component={
                                                <RoomDetailsPanel
                                                    room_object={this.props.room_object}
                                                    navigate_to_creator_profile={()=>{                                                                            
                                                        this.navigate_to_creator_profile(this.props.room_object.creator_info)
                                                    }}
                                                />
                                            }
                                        />
                                    )
                                }}
                            </Query>                   
                        </SafeAreaView>                
                    )
                }

            </ApolloConsumer>
        )
    }
}

const styles = StyleSheet.create({
    main_container:{
        backgroundColor:base_style.color.primary_color,
        flex:1
    },    

})

export default RoomDetails

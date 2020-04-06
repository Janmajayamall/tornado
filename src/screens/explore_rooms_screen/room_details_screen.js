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
import Loader from "./../../custom_components/loading/loading_component"

//importing graphql queries
import { GET_ROOM_POSTS, GET_ROOM_DEMOGRAPHICS } from "../../apollo_client/apollo_queries/index";


class RoomDetails extends React.Component{

    static propTypes = {
        room_id:PropTypes.any
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

            <SafeAreaView style={styles.main_container}> 
                {/* query for retrieving room details */}
                <Query
                    query={GET_ROOM_DEMOGRAPHICS}
                    variables={{
                        room_id:this.props.room_id
                    }}
                >
                    {({loading, error, data})=>{

                        //getting demographics
                        const get_room_demographics = data ? data.get_room_demographics : undefined
                        return(                            
                            <Query 
                                query={GET_ROOM_POSTS}
                                variables={{
                                    limit:5,
                                    room_id:this.props.room_id
                                }}
                            >
                                {({ loading: loading_two, error: error_two, data, fetchMore }) => {
                                    const get_room_posts_room_id = data ? data.get_room_posts_room_id : undefined
                                    if(get_room_demographics && get_room_posts_room_id){
                                        return(
                                            <ContentList
                                                componentId={this.props.componentId}
                                                room_posts={get_room_posts_room_id ? get_room_posts_room_id.room_posts : []}
                                                on_load_more={()=>{
                                                    fetchMore({
                                                        //getting more posts using cursor
                                                        query:GET_ROOM_POSTS,
                                                        variables:{
                                                            limit:5,
                                                            room_post_cursor:get_room_posts_room_id.room_post_cursor,
                                                            room_id:this.props.room_id
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
                                                        room_object={get_room_demographics}
                                                        navigate_to_creator_profile={()=>{                                                                            
                                                            this.navigate_to_creator_profile(get_room_demographics.creator_info)
                                                        }}
                                                    />
                                                }
                                            />
                                        )
                                    }
                        
                                    //if loading or any error 
                                    return(
                                        <Loader/>
                                    )
                                                                
                                }}
                            </Query>                   
                        
                        )
                    }}
                </Query>        
            </SafeAreaView>                

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


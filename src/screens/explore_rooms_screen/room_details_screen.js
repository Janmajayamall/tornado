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
    FEED_SCREEN
} from "../../navigation/screens";

//importing base style 
import base_style from "../../styles/base"

//importing custom components
import RoomDetailsPanel from "./components/room_details_panel"
import ContentList from "./../../custom_components/content_list/content_list"

//importing graphql queries
import { GET_ROOM_POSTS } from "../../apollo_client/apollo_queries/index";


class RoomDetails extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            selected_set:new Set(),
        }
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
                                    room_id:"5e67c84ab69762f9dfac7c74"
                                }}
                            >
                                {({ loading, error, data, fetchMore }) => {
                                    // console.log(data, error, loading)
                                    return(
                                        <ContentList
                                            componentId={this.props.componentId}
                                            loading={loading}
                                            room_posts={data ? data.get_room_posts_room_id.room_posts : []}
                                            on_load_more={()=>{
                                                fetchMore({
                                                    //getting more posts using cursor
                                                    query:GET_ROOM_POSTS,
                                                    variables:{
                                                        limit:5,
                                                        room_post_cursor:data.get_room_posts_room_id.room_post_cursor,
                                                        room_id:"5e67c84ab69762f9dfac7c74" //TODO: replace room_id with passed in props room_id
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
                                            header_component={<RoomDetailsPanel/>}
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

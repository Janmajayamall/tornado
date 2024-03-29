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
    Query,
    withApollo
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
import ErrorComponent from "./../../custom_components/loading/error_component"

//importing graphql queries
import { 
    GET_ROOM_POSTS, 
    GET_ROOM_DEMOGRAPHICS,
    GET_BLOCKED_USERS
} from "../../apollo_client/apollo_queries/index";
import { 
    constants,
    filter_blocked_posts
} from "../../helpers";
import bugsnag from "../../bugsnag/bugsnag";


class RoomDetails extends React.Component{

    static propTypes = {
        room_id:PropTypes.any
    }

    constructor(props){
        super(props)

        this.state = {
            blocked_ids_set:undefined
        }

    }

    componentDidMount(){
        //binding the topBar add post button 
        this.navigation_event_listener = Navigation.events().bindComponent(this);

        this.get_blocked_users()
    }

    componentWillUnmount(){
        this.navigation_event_listener.remove()
    }

    //for topBar buttons
    navigationButtonPressed({ buttonId }) {
        if(buttonId === constants.navigation.action_buttons.BACK){
            Navigation.pop(this.props.componentId)
        }
    }  
    
    navigate_to_creator_profile = (user_id, is_user) => {
        navigation_push_to_screen(this.props.componentId, {
            screen_name:PROFILE_SCREEN,
            props:{
                is_user:is_user,
                user_id:user_id
            }
        })
    }

    get_blocked_users = async() => {
        try{
            const {data} = await this.props.client.query({
                query:GET_BLOCKED_USERS,
                fetchPolicy:"network-only"
            })
          
            const {get_blocked_users} = data
            const blocked_ids_set = new Set()
            get_blocked_users.forEach((object)=>{
                blocked_ids_set.add(object.blocked_user_id)
            })
            
            this.setState({
                blocked_ids_set:blocked_ids_set
            })
        }catch(e){
            if(__DEV__){
                console.log(e, "room_details_screen.js | get_blocked_users")
            }
            bugsnag.notify(e)
        }
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
                    {({data, refetch, error})=>{

                        const room_demographics_refetch = refetch
                        const room_demographics_error = !!error

                        //getting demographics
                        const get_room_demographics = data ? data.get_room_demographics : undefined
                        return(                            
                            <Query 
                                query={GET_ROOM_POSTS}
                                variables={{
                                    limit:constants.apollo_query.pagination_limit,
                                    room_id:this.props.room_id
                                }}
                                fetchPolicy={"cache-and-network"}
                            >
                                {({ data, fetchMore, refetch, networkStatus, error }) => {

                                    const room_posts_refetch = refetch
                                    const room_posts_error = !!error
                                    const get_room_posts_room_id = data ? data.get_room_posts_room_id : undefined

                                    if(get_room_demographics && get_room_posts_room_id && this.state.blocked_ids_set){
                                        return(
                                            <ContentList
                                                componentId={this.props.componentId}
                                                room_posts={get_room_posts_room_id ? filter_blocked_posts(get_room_posts_room_id.room_posts, this.state.blocked_ids_set) : []}
                                                on_load_more={()=>{
                                                    fetchMore({
                                                        //getting more posts using cursor
                                                        query:GET_ROOM_POSTS,
                                                        variables:{
                                                            limit:constants.apollo_query.pagination_limit,
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
                                                            this.navigate_to_creator_profile(get_room_demographics.creator_info.user_id, get_room_demographics.is_user)
                                                        }}
                                                        componentId={this.props.componentId}
                                                    />
                                                }
                                                avatar_navigate_user_profile={true}

                                                //refetch & networkStatus
                                                refetch={refetch}
                                                networkStatus={networkStatus}
                                            />
                                        )
                                    }

                                    if(room_demographics_error || room_posts_error){
                                            return(
                                                <ErrorComponent
                                                    retry={()=>{
                                                        if(room_posts_refetch){
                                                            room_posts_refetch()
                                                        }
                                                        if(room_demographics_refetch){
                                                            room_demographics_refetch()
                                                        }
                                                    }}
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

export default withApollo(RoomDetails)


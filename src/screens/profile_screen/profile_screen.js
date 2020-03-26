import React from 'react'
import { connect } from 'react-redux'
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Dimensions,
    SafeAreaView

} from 'react-native'
import base_style from './../../styles/base'
import {
    Query, 
    ApolloConsumer,
    withApollo
} from 'react-apollo'
import { Navigation } from "react-native-navigation"
import PropTypes from "prop-types"

//importing queries/mutations in gql
import {
    GET_ROOM_FEED,
    GET_LOCAL_USER_INFO,
    GET_USER_PROFILE_POSTS
} from "./../../apollo_client/apollo_queries/index"

//importing components 
import ContentList from "./../../custom_components/content_list/content_list"
import ProfileDetails from "./components/profile_details"

//importing helpers & constants
import {
    constants
} from "./../../helpers/index"

//importing screens and navigation functions
import { navigation_push_to_screen } from '../../navigation/navigation_routes';
import {  
    ADD_ROOMS_SCREEN
} from "./../../navigation/screens";

const window = Dimensions.get("window")


class ProfileScreen extends React.PureComponent {

    static propTypes = {
        is_user_profile:PropTypes.bool,
        profile_user_id:PropTypes.string
    }

    constructor(props){

        super(props)

        this.state={
            user_info:undefined
        }

        //binding the topBar add post button 
        Navigation.events().bindComponent(this);



    }

    //react native navigation event binded function for action buttons
    navigationButtonPressed({ buttonId }) {

        if (buttonId===constants.navigation.action_buttons.ADD_ROOM){
            console.log(buttonId)
            navigation_push_to_screen(this.props.componentId,
                    {
                        screen_name:ADD_ROOMS_SCREEN,
                        options:{
                            topBar: {
                                rightButtons: [
                                    {
                                        id: constants.navigation.action_buttons.CREATE_ROOM,
                                        text:"Create Room"
                                    }
                                ]
                            }
                        }
                    }
                )
        }

        }
    
    
    set_user_info = async(client) => {

        if(!this.props.is_user_profile){
            //get the profile of the user
            console.log("Profile screen of some other user")
            return
        }

        const {user_info} = await client.readQuery({
            query:GET_LOCAL_USER_INFO
        })
        this.setState({
            user_info:user_info

        })
    }


    render(){

        return(
            <SafeAreaView style={styles.main_container}>
                <ApolloConsumer>
                    {
                        client=>{

                            return(
                                <Query 
                                    query={GET_USER_PROFILE_POSTS}
                                    variables={{
                                        limit:5
                                    }}
                                >
                                    {({ loading, error, data, fetchMore }) => {

                                        this.set_user_info(client)
                                        console.log(loading, error, data)
                                        if (this.state.user_info===undefined){
                                            return(
                                                <Text>
                                                    Loading....sorry
                                                </Text>
                                            )
                                        }

                                        if (error){
                                            return(
                                                <Text>
                                                    error sorry
                                                </Text>
                                            )
                                        }
                                        
                                        return(
                                            <ContentList
                                                componentId={this.props.componentId}
                                                loading={loading}
                                                room_posts={data ? data.get_user_profile_posts.room_posts : []}
                                                on_load_more={()=>{
                                                    fetchMore({
                                                        //getting more posts using cursor
                                                        query:GET_USER_PROFILE_POSTS,
                                                        variables:{
                                                            limit:5,
                                                            room_post_cursor:data.get_user_profile_posts.room_post_cursor
                                                        },
                                                        updateQuery: (previous_data, {fetchMoreResult}) => {
                                                            //appending to the previous result 
                        
                                                            if (!previous_data.get_user_profile_posts.next_page){
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
                                                header_component={
                                                    <View style={styles.header_container}>
                                                        <ProfileDetails
                                                            width={window.width}
                                                            user_info={this.state.user_info}
                                                        />
                                                    </View>
                                                }
                                                header_display={true}  
                                            />
                                        )
                                    }}
                                </Query>
                        
                            )
                    }
                    }
                </ApolloConsumer>
            </SafeAreaView>
                
        )
    }

}

const styles = StyleSheet.create({
    main_container:{
        backgroundColor:base_style.color.primary_color,
        flex:1
    },
    header_container:{
        backgroundColor:base_style.color.primary_color,
        padding:10,
        // borderBottomColor:"white",
        // borderBottomWidth:5
    },

})

export default ProfileScreen


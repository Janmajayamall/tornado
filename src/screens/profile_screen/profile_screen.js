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
    GET_USER_PROFILE_POSTS,
    GET_USER_INFO
} from "./../../apollo_client/apollo_queries/index"

//importing components 
import ContentList from "./../../custom_components/content_list/content_list"
import ProfileDetails from "./components/profile_details"
import SmallButton from "./../../custom_components/buttons/small_button"
import Loader from "./../../custom_components/loading/loading_component"

//importing helpers & constants
import {
    constants
} from "./../../helpers/index"

//importing screens and navigation functions
import { navigation_push_to_screen } from '../../navigation/navigation_routes';
import {  
    ADD_ROOMS_SCREEN,
    EDIT_PROFILE_SCREEN,
    JOINED_ROOMS_SCREEN,
    SETTINGS_SCREEN,
} from "./../../navigation/screens";

const window = Dimensions.get("window")


class ProfileScreen extends React.Component {

    static propTypes = {
        is_user:PropTypes.bool,

        //user_id is only required when is_user is false
        profile_user_info:PropTypes.object,
        user_id:PropTypes.string

    }

    constructor(props){

        super(props)

        this.state={
            user_info:undefined,
            
            loading:false
        }
        this.set_user_info()
    }


    componentDidMount(){

        // adding event for navigation
        this.navigationEventListener = Navigation.events().bindComponent(this);
    }

    //react native navigation event binded function for action buttons
    navigationButtonPressed({ buttonId }) {
        if (buttonId===constants.navigation.action_buttons.SETTINGS){
            navigation_push_to_screen(this.props.componentId,
                    {
                        screen_name:SETTINGS_SCREEN,                
                    }
                )
        }
    }

    render_again = () => {
        this.setState({
            loading:true
        })
        this.set_user_info()
        // this.forceUpdate()
    }


    navigate_to_add_new_room = () => {
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
    

    navigate_to_edit_profile = () => {
        navigation_push_to_screen(this.props.componentId,
            {
                screen_name:EDIT_PROFILE_SCREEN,
                options:{
                    topBar: {
                        rightButtons: [
                            {
                                id: constants.navigation.action_buttons.EDIT_PROFILE,
                                text:"Confirm"
                            }
                        ]
                    }
                },
                props:{
                    render_edit_profile_screen:this.render_again
                }
            }
        )
    }
    
    set_user_info = async() => {

        try{
            const {data} = await this.props.client.query({
                query:GET_USER_INFO,
                variables:this.props.is_user ? {} :
                                                {
                                                    user_id:this.props.user_id
                                                }
            })

            this.setState({
                user_info:data.get_user_info,
                loading:false                
            })
        }catch(e){
            console.log(e, "profile_screen.js | function set_user_info()")
        }

        // if(this.props.is_user){
        //     const {data} = await this.props.client.query({
        //         query:GET_USER_INFO,
                
        //     })
            
        //     this.setState({
        //         user_info:data.get_user_info,
        //         loading:false                
        //     })
        // }else{

        // }
    }

    navigation_to_joined_rooms = (query_type) => {

        let screen_vars = {
            screen_name:JOINED_ROOMS_SCREEN,
            props:{
                query_type:query_type,
                is_user:true

            }
        }

        //adding other_user_id or other_user_id_arr depending on the query type
        if(!this.props.is_user){

            //set props is_user to false
            screen_vars.props.is_user=false

            // get_all_created rooms or get_all_joined_rooms
            if(query_type===constants.queries.get_all_created_rooms || query_type===constants.queries.get_all_joined_rooms){
                screen_vars.props.other_user_id=this.props.user_id
            }

            // get_common_rooms
            if(query_type===constants.queries.get_common_rooms){
                screen_vars.props.other_user_id_arr=[this.props.user_id]
            }
        }

        navigation_push_to_screen(this.props.componentId,screen_vars)
    }

    

    generate_lower_body = () => {
        
        //if not user's profile
        if (!this.props.is_user ){
            return(
                <View style={styles.small_buttons_container}>
                    <Text style={{...base_style.typography.small_font, fontStyle:"italic"}}>
                        {"Rooms "}
                    </Text>
                    <SmallButton
                        button_text={"Created"}
                        onPress={()=>{this.navigation_to_joined_rooms(constants.queries.get_all_created_rooms)}}
                    />
                    <Text style={{...base_style.typography.small_font, fontStyle:"italic"}}>
                        {" , "}
                    </Text>
                    <SmallButton
                        button_text={"Joined"}
                        onPress={()=>{this.navigation_to_joined_rooms(constants.queries.get_all_joined_rooms)}}
                    />
                    <Text style={{...base_style.typography.small_font, fontStyle:"italic"}}>
                        {" & in "}
                    </Text>
                    <SmallButton
                        button_text={"Common"}
                        onPress={()=>{this.navigation_to_joined_rooms(constants.queries.get_common_rooms)}}
                    />       
                </View>
            )
        }

        return(
            <View style={styles.small_buttons_container}>
                <SmallButton
                    button_text={"Edit profile"}
                    onPress={this.navigate_to_edit_profile}
                />
                <Text style={{...base_style.typography.small_font, fontStyle:"normal"}}>
                    {"  |  "}
                </Text>
                <SmallButton
                    button_text={"Create a room"}
                    onPress={this.navigate_to_add_new_room}        
                />
                <Text style={{...base_style.typography.small_font, fontStyle:"normal"}}>
                    {"  |  "}
                </Text>
                <SmallButton
                    button_text={"Joined Rooms"}
                    onPress={()=>{this.navigation_to_joined_rooms(constants.queries.get_all_joined_rooms)}}
                />       
            </View>
        )

    }

    render(){
        return(
            <SafeAreaView style={styles.main_container}>
                <Query 
                    query={GET_USER_PROFILE_POSTS}
                    variables={
                        this.props.is_user?
                        {
                            limit:5,                                            
                        }:
                        {
                            limit:5,
                            user_id:this.props.user_id
                        }
                    }
                    fetchPolicy={"cache-and-network"}
                >
                    {({ data, fetchMore, refetch, networkStatus }) => {
                        // if data is not undefined then render screen
                        if(data && this.state.user_info && !this.state.loading){

                            return(
                                <ContentList
                                    componentId={this.props.componentId}
                                    room_posts={data ? data.get_user_profile_posts.room_posts : []}
                                    on_load_more={()=>{
    
                                        //generating variables
                                        const fetch_variables = {
                                            limit:5,
                                            room_post_cursor:data.get_user_profile_posts.room_post_cursor,                                                        
                                        }
                                        if(!this.props.is_user){
                                            fetch_variables.user_id = this.props.user_id
                                        }
    
                                        fetchMore({
                                            //getting more posts using cursor
                                            query:GET_USER_PROFILE_POSTS,
                                            variables:fetch_variables,
                                            updateQuery: (previous_data, {fetchMoreResult}) => {
                                                //appending to the previous result 
            
                                                if (!previous_data.get_user_profile_posts.next_page){
                                                    return previous_data
                                                }
            
                                                const new_posts_arr = [
                                                    ...previous_data.get_user_profile_posts.room_posts,
                                                    ...fetchMoreResult.get_user_profile_posts.room_posts
                                                ]
            
                                                const new_data_object = {
                                                    ...fetchMoreResult, 
                                                    get_user_profile_posts:{
                                                        ...fetchMoreResult.get_user_profile_posts,
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
                                            {
                                                this.generate_lower_body()
                                            }
                                            
                                        </View>
                                    }
                                    header_display={true}  
                                    avatar_navigate_user_profile={false}

                                    //refetch && networkStatus
                                    refetch={refetch}
                                    networkStatus={networkStatus}
                                />
                            )
                        }

                        // if anything goes wrong or loadinng
                        return(
                            <Loader/>
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
    header_container:{
        backgroundColor:base_style.color.primary_color,
        padding:10
        // borderBottomColor:"white",
        // borderBottomWidth:5
    },
    small_buttons_container:{
        flexDirection:"row",
        marginTop:10,
        justifyContent:"center"
    }

})

export default withApollo(ProfileScreen)


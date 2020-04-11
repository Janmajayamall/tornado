import React from 'react'
import { connect } from 'react-redux'
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    SafeAreaView,
    Keyboard,
    Dimensions,
    Alert
} from 'react-native'
import base_style from './../../styles/base'
import {
    Query,
    Mutation,
    useQuery,
    ApolloConsumer
} from 'react-apollo'
import {Navigation} from "react-native-navigation"
import PropTypes from "prop-types"

//importing queries/mutations in gql
import {
    CREATE_COMMENT,
    GET_POST_COMMENTS, 
    GET_USER_INFO,
    POST_OBJECT,
    CREATE_CAPTION,
    GET_POST_CAPTIONS
} from "./../../apollo_client/apollo_queries/index"

//importing components 
import AvatarTextPanel from "./../../custom_components/user_attributes/avatar_text_panel"
import QueryComments from "./wrapper_components/query_comments"
import base from './../../styles/base';
import { constants } from '../../helpers'
import Loader from "./../../custom_components/loading/loading_component"
import ErrorComponent from "./../../custom_components/loading/error_component"
import moment from "moment"

const window = Dimensions.get("window")

class Comment extends React.PureComponent {

    static propTypes = {
        post_id: PropTypes.any,
        query_type:PropTypes.string
    }

    constructor(props){
        super(props)
    
        this.state = {
            comment_list_padding:0,
            post_comment_box_padding:20,
            comment_container_height:0
        }

        //refetches
        this.post_refetch=null
    }   

    componentDidMount(){
        this.keyboard_did_show_listener = Keyboard.addListener("keyboardWillShow", this._keyboard_did_show)
        this.keyboard_will_hide_listener = Keyboard.addListener("keyboardWillHide", this._keyboard_will_hide)
    }


    _keyboard_did_show = (e) => {
        if (e){
            this.setState((prev_state)=>{
                const temp_height_list = prev_state.comment_list_padding+e.endCoordinates.height
                return({
                    comment_list_padding:temp_height_list, 
                    post_comment_box_padding:e.endCoordinates.height+prev_state.post_comment_box_padding
                })
            })
        }
    }   

    _keyboard_will_hide = (e) => {
        this.setState({comment_list_padding:this.state.comment_container_height, post_comment_box_padding:20})//padding for input at bottom 
    }

    componentWillUnmount(){
        this.keyboard_did_show_listener.remove()
        this.keyboard_will_hide_listener.remove()
    }

    //generating input box at the bottom
    generate_input_box = (user_info, post_object) => {
        if(this.props.query_type===constants.comment_list_query_type.caption_query){     
            return this.post_caption(user_info, post_object)
        }

        if(this.props.query_type===constants.comment_list_query_type.comment_query){
            return this.post_comment(user_info, post_object)
        }

    }

    alert_error = () => {
        Alert.alert(
            "Sorry",
            "Something went wrong!",
            [
                {text: 'OK', onPress: () => {}},
            ],
            { cancelable: false }
        ) 
    }

    post_comment = (user_info, post_object) => {

        return(
            <Mutation 
                mutation={CREATE_COMMENT}
                onError={()=>{
                    this.alert_error()   
                }}
            >
                {mutate => {
                    return(
                        <AvatarTextPanel
                            user_object={user_info}
                            is_user={post_object.is_user}
                            panel_type={constants.avatar_text_panel_type.comment_input}
                            create_comment_func={(comment_body)=>{

                                //close the keyboard 
                                Keyboard.dismiss()

                                //generating variables object for comment input
                                const variables = {
                                    content_id:post_object._id,
                                    content_type:post_object.post_type,
                                    comment_body:comment_body,
                                    user_id:user_info.user_id
                                }

                                mutate({
                                    variables:variables,
                                    optimisticResponse:()=>{
                                        let optimistic_response = {
                                            __typename:"Mutation",
                                            create_comment:{
                                                _id: new Date().toISOString(),
                                                content_id: post_object._id,
                                                comment_body: comment_body, 
                                                content_type: post_object.post_type,
                                                __typename: "Comment"
                                            }
                                        }
                                        return optimistic_response
                                    },
                                    update:(proxy, {data:{create_comment}})=>{                                        
                                        //generating comment object temp
                                        /*
                                            In this case please note the following
                                            1. __typename returned is "Comment" for CREATE_COMMENT query, not "Comment_with_creator"
                                            2. __typename for comment returned in query "GET_POST_COMMENTS" is "Comment_with_creator", hence you need to change the __typename here
                                                otherwise it will throw error.
                                            3. Also populate the rest of the information (i.e. creator_info object, timestamp, last_modified) in the crete_comment object, so 
                                                that object keys match with prior comments object keys.
                                        */
                                        const get_comment_obj = {
                                            ...create_comment,
                                            timestamp:new Date().toISOString(),
                                            last_modified:new Date().toISOString(),
                                            creator_info:user_info,
                                            is_user:true,
                                            __typename:"Comment_with_creator"                                             
                                        }

                                        const cache_query = {
                                            query:GET_POST_COMMENTS,
                                            variables:{
                                                content_id:post_object._id,
                                                content_type:"ROOM_POST"
                                            }
                                        }

                                        //reading query response from cache
                                        const data = proxy.readQuery(cache_query)
                                    
                                        //appending it to get_post_comments arr 
                                        data.get_post_comments.push(get_comment_obj)

                                        //writing the update get_post_comments data to cache
                                        proxy.writeQuery({
                                            query:GET_POST_COMMENTS,
                                            variables:{
                                                content_id:post_object._id,
                                                content_type:post_object.post_type
                                            },
                                            data:{
                                                ...data
                                            }
                                        })
                                    }
                                })
                            }}
                        />
                    )
                }}                                               
            </Mutation>
        )
    }

    post_caption = (user_info, post_object) => {

        return(
            <Mutation 
                mutation={CREATE_CAPTION}
                onError={()=>{
                    this.alert_error()   
                }}
            >
                {mutate => {
                    return(
                        <AvatarTextPanel
                            user_object={user_info}
                            is_user={post_object.is_user}
                            panel_type={constants.avatar_text_panel_type.caption_input}
                            avatar_navigate_user_profile={false}
                            create_caption_func={(caption_body)=>{

                                //close the keyboard
                                Keyboard.dismiss()

                                //generating variables object for comment input
                                const variables = {
                                    post_id:post_object._id,
                                    description:caption_body
                                }

                                mutate({
                                    variables:variables,
                                    optimisticResponse:()=>{
                                        let optimistic_response = {
                                            __typename:"Mutation",
                                            create_caption:{
                                                _id: new Date().toISOString(),
                                                post_id:post_object._id,
                                                creator_info:{
                                                    user_id: user_info.user_id,
                                                    avatar: user_info.avatar,
                                                    username: user_info.username,
                                                    three_words: user_info.three_words,
                                                    __typename: "User_account"
                                                },                                                                         
                                                timestamp: new Date().getTime(),
                                                last_modified: new Date().getTime(),
                                                description: caption_body,
                                                up_votes_count: 0,
                                                down_votes_count: 0,
                                                user_vote_object: null,
                                                is_user: true,
                                                __typename: "Caption"
                                            }
                                        }
                                        return optimistic_response
                                    },
                                    update:(proxy, {data:{create_caption}})=>{
                                        console.log(create_caption)
                                        //reading from cache all the captions of the current post
                                        const cache_query = {
                                            query:GET_POST_CAPTIONS,
                                            variables:{
                                                post_id:post_object._id,
                                            }
                                        }
                                        const data = proxy.readQuery(cache_query)
                                        //appending new caption to existing captions & creating new data object
                                        let new_data = {
                                            ...data,
                                            get_post_captions:[
                                                ...data.get_post_captions,
                                                create_caption
                                            ]
                                        }

                                        //writing the update get_post_comments data to cache
                                        proxy.writeQuery({
                                            query:GET_POST_CAPTIONS,
                                            variables:{
                                                post_id:post_object._id,
                                            },
                                            data:new_data
                                        })
                                    }
                                })
                            }}
                        />
                    )
                }}                                               
            </Mutation>
        )
    }

    on_comment_container_render = (e) => {
        this.setState({comment_container_height:e.nativeEvent.layout.height, comment_list_padding:e.nativeEvent.layout.height})
    }

    render(){

        return(

            <Query
                query={POST_OBJECT}
                variables={{
                    _id:this.props.post_id
                }}
            >
                {({loading, networkStatus, error, data, refetch})=>{   

                    const post_object = data ? data.post_detailed_screen : undefined

                    //render the screen after getting the post object from local cache
                    if(post_object){
                        return(
                            <SafeAreaView
                                style={styles.main_container}
                            >   
                                <View style={[styles.query_comments_container,{height:this.state.comment_list_height}]}>                                    
                                    <QueryComments
                                        bottom_padding={this.state.comment_list_padding}
                                        post_object={post_object}
                                        query_type={this.props.query_type}
                                        componentId={this.props.componentId}
                                    />                                                              
                                </View>
            
                                {/* creating comment section */}
                                <View 
                                    onLayout={this.on_comment_container_render}
                                    style={[styles.create_comment_container, {paddingBottom:this.state.post_comment_box_padding}]}
                                >
                                    <Query query={GET_USER_INFO}>
                                        {({loading, error, data, refetch})=>{


                                            const user_info = data ? data.get_user_info : undefined        
                                            
                                            //render input area at bottom only is user info is present
                                            if (data){
                                                return (
                                                    <View>
                                                        {
                                                            this.generate_input_box(user_info, post_object)
                                                        }
                                                    </View>

                                                )
                                            }

                                            return <Loader/>
                                            
                                        }}
                                    </Query>                    
                                </View>
            
                            </SafeAreaView>
                    
                        )
                    }

                    if(!!error){
                        <ErrorComponent
                            retry={()=>{
                                refetch()
                            }}
                        />
                    }

                    //otherwise load
                    return(
                        <Loader/>
                    )

                }}
            </Query>

        )
    }

}

const styles = StyleSheet.create(
    {
        main_container:{
            flex: 1,
            backgroundColor:base_style.color.primary_color
        },
     
        create_comment_container:{
            width: '100%', 
            position: "absolute",
            bottom: 0,
            borderTopColor:base.color.primary_color_lighter,
            backgroundColor:base.color.primary_color,
            borderTopWidth:1
        },

        query_comments_container:{
            flex:1,
            justifyContent:"center",
            alignItems:"center",
            width: '100%', 
        }

    });

export default Comment
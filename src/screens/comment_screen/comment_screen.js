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
    Dimensions
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
    POST_OBJECT
} from "./../../apollo_client/apollo_queries/index"

//importing components 
import CommentList from "./../../custom_components/comments/comment_list"
import AvatarTextPanel from "./../../custom_components/user_attributes/avatar_text_panel"
import QueryComments from "./wrapper_components/query_comments"
import base from './../../styles/base';

const window = Dimensions.get("window")

class Comment extends React.PureComponent {

    static propTypes = {
        post_id: PropTypes.any
    }

    constructor(props){
        super(props)
    
        this.state = {
            comment_list_padding:0,
            post_comment_box_padding:0,
            comment_container_height:0
        }

        console.log(this.props)
    }   

    componentDidMount(){
        this.keyboard_did_show_listener = Keyboard.addListener("keyboardWillShow", this._keyboard_did_show)
        this.keyboard_will_hide_listener = Keyboard.addListener("keyboardWillHide", this._keyboard_will_hide)

    }

    // componentDidAppear(ee){
    //     console.log(ee, "event")
    // }

    _keyboard_did_show = (e) => {
        if (e){
            this.setState((prev_state)=>{
                const temp_height_list = prev_state.comment_list_padding+e.endCoordinates.height
                return({
                    comment_list_padding:temp_height_list, 
                    post_comment_box_padding:e.endCoordinates.height
                })
            })
        }
    }   

    _keyboard_will_hide = (e) => {
        this.setState({comment_list_padding:this.state.comment_container_height, post_comment_box_padding:0})
    }

    componentWillUnmount(){
        this.keyboard_did_show_listener.remove()
        this.keyboard_will_hide_listener.remove()
    }

    post_comment = (mutate, user_info, post_object) => {
        
        return (
            <AvatarTextPanel
                avatar={post_object.creator_info.avatar}
                default_avatar={post_object.creator_info.default_avatar}
                is_description={false}                                    
                content_id={post_object._id}
                content_type={post_object.post_type}
                create_comment_func={(comment_obj)=>{
            
                    //populating comment object with user_id of the user 
                    comment_obj.user_id = user_info.user_id

                    mutate({
                        variables:comment_obj,
                        optimisticResponse:{
                            __typename: "Mutation",
                            create_comment:{
                                _id:"fake id",
                                content_id:comment_obj.content_id,
                                content_type:comment_obj.content_type,
                                comment_body:comment_obj.comment_body,
                                __typename:"Comment_with_creator",
                            }
                        },
                        update:(proxy, {data:{create_comment}})=>{

                            //converting create_comment object to get_comments object
                            const get_comment_obj = {
                                ...create_comment,
                                timestamp:new Date().toISOString(),
                                last_modified:new Date().toISOString(),
                                creator_info:{
                                    username: user_info.username, 
                                    avatar: user_info.avatar,
                                    timestamp: new Date().toISOString(), 
                                    __typename: "User_account"
                                }                                                 
                            }

                            const cache_query = {
                                query:GET_POST_COMMENTS,
                                variables:{
                                    content_id:post_object._id,
                                    content_type:"ROOM_POST"
                                }
                            }
                            const data = proxy.readQuery(cache_query)
                            proxy.writeQuery({...cache_query, data:{
                                ...data,
                                get_post_comments:[
                                    ...data.get_post_comments,
                                    get_comment_obj
                                ]
                            }})
                        }
                    })
                }}
            />
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
                {({loading, error, data})=>{
                    const post_object = data ? data.post_detailed_screen : undefined
                    if(data && !loading){
                        return(
                            <SafeAreaView
                                style={styles.main_container}
                            >   
                                <View style={{height:this.state.comment_list_height}}>                                    
                                    <QueryComments
                                        bottom_padding={this.state.comment_list_padding}
                                        post_object={post_object}
                                    />                                                              
                                </View>
            
                                {/* creating comment section */}
                                <View 
                                    onLayout={this.on_comment_container_render}
                                    style={[styles.create_comment_container, {paddingBottom:this.state.post_comment_box_padding}]}
                                >
                                    <Query query={GET_USER_INFO}>
                                        {({loading, error, data})=>{
                                            const user_info = data ? data.get_user_info : undefined
                                            if (loading){
                                                return <Text>Loadingggg</Text>
                                            }
            
                                            if (error){
                                                console.log("Error in getting user_id from cache")
                                                return <Text>ERROR</Text>
                                            }
            
                                            //don't let the loading stop until data.user_info is not present. 
                                            //TODO: also is user_info is not present then log the user out
                                            if (data){
                                                return(
                                                    <Mutation mutation={CREATE_COMMENT}>
                                                        {mutate => {
                                                            return this.post_comment(mutate, user_info, post_object)
                                                        }}                        
                                                    </Mutation>
                                                )
                                            }    
                                            
                                        }}
                                    </Query>                    
                                </View>
            
                            </SafeAreaView>
                    
                        )
                    }

                    return(
                        <Text>
                            Loading!!
                        </Text>
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

    });

export default connect(undefined,  undefined)(Comment)
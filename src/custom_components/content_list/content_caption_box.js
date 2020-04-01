import React, {useMemo} from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Dimensions,
    Image,
    TouchableOpacity,
} from 'react-native'
import PropTypes from 'prop-types'
import {Navigation} from "react-native-navigation"
import { 
    Mutation, Query
 } from "react-apollo";
 import base_style from "./../../styles/base"

//customer components
import AsyncImage from '../image/async_image'
import AvatarTextPanel from "./../user_attributes/avatar_text_panel"
import CaptionPanel from "./caption_panel"

//importing graphql queries
import {
    GET_USER_INFO,
    TOGGLE_LIKE,
    GET_ROOM_FEED
} from "./../../apollo_client/apollo_queries/index"


// import screens & navigation functions
import {
    COMMENT_SCREEN,
    ROOM_NAME_LIST
} from "./../../navigation/screens"
import {  
    navigation_push_to_screen
} from "./../../navigation/navigation_routes/index";

// importing helpers
import { 
    constants,
    get_relative_time_ago
} from '../../helpers';



const window = Dimensions.get('window')

class ContentCaptionBox extends React.PureComponent {

    static propTypes = {
        post_object:PropTypes.object,
        om_feed:PropTypes.bool,
        componentId:PropTypes.any,

        //boolean whether avatar text panel for user is clickable or not
        avatar_navigate_user_profile:PropTypes.any

    }

    constructor(props){

        super(props)
        this.state={
            img_width:window.width,
            img_height:window.width*1.2,

            //for like functionality
            user_liked:false,
            likes_count:2
        }

    }

    toggle_like = () => {

        if (this.props.toggle_post_like){
            this.props.toggle_post_like()
        }

        // check for clarity
        if (this.state.likes_count === 0 && this.state.user_liked === true){
            return
        }

        this.setState((prev_state)=>{
            const temp_likes_count = prev_state.user_liked ? prev_state.likes_count-1 : prev_state.likes_count+1
            return({
                likes_count:temp_likes_count,
                user_liked:!prev_state.user_liked
            })
        })
    }

    navigate_to_comment_screen = () => {
        Navigation.push(this.props.componentId, {
            component: {
                name: COMMENT_SCREEN,
                passProps: {
                    post_id:this.props.post_object._id,
                    query_type:constants.comment_list_query_type.caption_query
                },
                options: {
                    bottomTabs:{
                        visible:false
                    }
                },
                topBar:{
                    leftButtons: [
                        {
                            id: 'back',
                            icon: {
                                uri: 'back',
                            },
                        },
                    ],
                }
            }
        });

    }

    generate_room_ids_name = () => {
        let room_names = ""
        this.props.post_object.room_objects.forEach((room_object, index)=>{

            if(index!==0){
                room_names+=" | "
            }
            room_names+=room_object.name
            
        })
        return room_names
    }

    navigate_to_room_list = () => {
        navigation_push_to_screen(this.props.componentId, {
            screen_name:ROOM_NAME_LIST,
            props:{
                room_objects:this.props.post_object.room_objects
            }
        })
    }

    render(){
        return(
            <View 
                style={styles.main_container}
            
            >

                {/* avatar panel */}
                <View style={styles.user_content_container}>
                    <AvatarTextPanel
                        user_object={this.props.post_object.creator_info}
                        panel_type={constants.avatar_text_panel_type.user}
                        avatar_navigate_user_profile={this.props.avatar_navigate_user_profile}
                    />
                </View>

                {/* displaying the post image */}
                <View>
                    <AsyncImage
                        image_object={{
                            width: 512,
                            height: 512,
                            cdn_url: "https://d99qv6hi77isg.cloudfront.net",
                            image_name: "5e7d63e09c33fb6a88ff250c_2020-03-28T20:02:53.005Z.jpeg",
                        }}
                        window_dimensions={window}
                    />
                </View>

                {/* time & number of likes */}
                <View style={styles.time_likes_count_container}>
                    <Text style={[base_style.typography.small_font, {fontStyle:"italic", alignSelf:"flex-end"}]}>
                        {`about ${get_relative_time_ago(this.props.post_object.timestamp)}`}
                    </Text>
                </View>

                {/* comment and like */}
                <View style={styles.like_comment_main_container}>
                        
                <Mutation 
                    mutation={TOGGLE_LIKE}
                    optimisticResponse={()=>{                            
                        let optimisitic_response = {
                            __typename:"Mutation",
                            toggle_like:{
                                _id:new Date().toISOString(),
                                content_id:this.props.post_object._id,                                                                                                
                            }                        
                        }
                        if(this.props.post_object.user_liked){
                            optimisitic_response.toggle_like.status=constants.status.not_active
                        }else{
                            optimisitic_response.toggle_like.status=constants.status.active
                        }
                        optimisitic_response.toggle_like.__typename="Like"
                        return optimisitic_response
                    }}
                    update={(cache, {data})=>{

                        const {get_room_posts_user_id} = cache.readQuery({
                            query:GET_ROOM_FEED,
                            variables:{
                                limit:5
                            }
                        })
                        
                        //getting toggle like result
                        const toggle_result = data.toggle_like
                        console.log(toggle_result, data, "kilo d")


                        // return
                        //checking if there is any need to update
                        if(toggle_result.user_liked===this.props.post_object.user_liked){
                            return
                        }
                        
                        //taking care of the liked/unliked post & the likes count
                        const updated_room_posts_arr = []
                        get_room_posts_user_id.room_posts.forEach(post=>{
                            if(post._id===toggle_result.content_id){
                                const new_post_obj = {
                                    ...post
                                }
                                if(toggle_result.status===constants.status.active){
                                    new_post_obj.user_liked=true
                                    new_post_obj.likes_count+=1
                                }else{
                                    new_post_obj.user_liked=false
                                    new_post_obj.likes_count-=1
                                }

                                //fixing if user toggles fast
                                if(new_post_obj.likes_count<0){
                                    new_post_obj.likes_count=0
                                    new_post_obj.user_liked=!new_post_obj.user_liked
                                }

                                //pushing it into the arr
                                updated_room_posts_arr.push(new_post_obj)
                            }else{
                                updated_room_posts_arr.push(post)
                            }
                        })
                    
                        //updated get_room_posts_user_id object
                        const updated_get_room_posts = {
                            ...get_room_posts_user_id,
                            room_posts:updated_room_posts_arr
                        }
                        
                        // return
                        //writing it to the cache
                        cache.writeQuery({
                            query:GET_ROOM_FEED,
                            variables:{
                                limit:5
                            },
                            data:{                                            
                                get_room_posts_user_id:updated_get_room_posts
                            }
                        })
                    
                    }}

                >
                    {(toggle_like, {data})=>{ 
                        console.log("toggle like mutation")   
                        return(
                            <TouchableOpacity 
                                onPress={()=>{
                                                                                                    
                                    //generating like variables
                                    let variables = {
                                        content_id:this.props.post_object._id
                                    }
                                    //checking the status of current like
                                    if (this.props.post_object.user_liked){ //user_liked==true means user wants to unlike
                                        variables.status=constants.status.not_active
                                    }else{
                                        variables.status=constants.status.active //user_liked==false means user wants to like
                                    }
                                    //mutating the like object
                                    console.log(variables, "like post")
                                    toggle_like({
                                        variables:variables
                                    })

                                }}
                                style={styles.like_container}
                            >
                                <Text style={{backgroundColor:this.props.post_object.user_liked ? "white":"red"}}>
                                    {this.props.post_object.likes_count}
                                </Text>
                            </TouchableOpacity>
                        )
                    }}
                </Mutation>          
        

                    <TouchableOpacity style={styles.comment_container}
                        onPress={()=>{
                            if(!this.props.on_feed){
                                console.log("open comment")
                            }else{
                                this.navigate_to_comment_screen()
                            }
                        }}
                    >
                        <Text>
                            comment
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* displaying top rated captions */}
                <View>
                        {
                            this.props.post_object.caption_objects ?
                            this.props.post_object.caption_objects.map((object,index)=>{
                                return(
                                    <CaptionPanel
                                        caption_object={object}
                                        caption_index={index}
                                    />
                                )
                            }) :
                            undefined
                        }
                </View>

                <View style={[styles.horizontal_line, this.props.on_feed ? {marginBottom:15} : {}]}/>
                        

                {/* <View style={styles.horizontal_line}/> */}

            </View>
        )
    }

}

const styles = StyleSheet.create({

    main_container:{
        backgroundColor:base_style.color.primary_color,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        // marginTop:15,
        marginBottom:15
    },
    user_content_container:{
        
    },
    horizontal_line:{
        borderBottomColor:base_style.color.primary_color_lighter,
        borderBottomWidth:1,
        width:"100%",
    },
    like_comment_main_container:{
        flexDirection:"row"
    },
    like_container:{
        width:"50%",
        // borderRightWidth:2,
        // borderRightColor:base_style.color.primary_color_lighter

    },
    comment_container:{
        width:"50%"
    },
    shared_to_name_container:{
        width:"100%",
        padding:10,
    },
    shared_to_name_text:{
        ...base_style.typography.small_header,
        // fontStyle:"italic",
        // textDecorationLine:"underline"
    },
    time_likes_count_container:{
        width:"100%"
    }

})

export default ContentCaptionBox
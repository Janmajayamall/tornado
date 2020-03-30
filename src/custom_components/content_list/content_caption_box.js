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
    CREATE_LIKE,
    UNLIKE_CONTENT,
    GET_USER_INFO
} from "./../../apollo_client/apollo_queries/index"


// import screens & navigation functions
import {
    COMMENT_SCREEN,
    ROOM_NAME_LIST
} from "./../../navigation/screens"
import {  
    navigation_push_to_screen
} from "./../../navigation/navigation_routes/index";
import { 
    constants 
} from '../../helpers';



const window = Dimensions.get('window')

class ContentCaptionBox extends React.PureComponent {

    static propTypes = {
        post_object:PropTypes.object,
        om_feed:PropTypes.bool,
        componentId:PropTypes.any
    }

    constructor(props){

        super(props)
        console.log(this.props.post_object, "w")
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
                    post_object:{...this.props.post_object, user_liked:this.state.user_liked, likes_count:this.state.likes_count},
                    toggle_post_like:this.toggle_like
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
            <TouchableOpacity style={styles.main_container}>

 
            <View style={styles.user_content_container}>
                <AvatarTextPanel
                    user_object={this.props.post_object.creator_info}
                    panel_type={constants.avatar_text_panel_type.user}
                />
            </View>

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



                {/* comment and like */}
                <View style={styles.like_comment_main_container}>
                    <Query query={GET_USER_INFO}>
                        {({loading, error, data})=>{

                            //getting user_id
                            const {user_id} = data ? data.get_user_info : {}
                            
                            return (
                                <Mutation mutation={this.state.user_liked ? UNLIKE_CONTENT : CREATE_LIKE}>
                                    {(create_like, {})=>{    
                                        return(
                                            <TouchableOpacity 
                                                onPress={()=>{
                                                                                                                    
                                                    if(user_id===undefined){
                                                        return 
                                                    }

                                                    create_like({
                                                        variables:{
                                                            user_id:user_id,
                                                            like_type:this.props.post_object.post_type,
                                                            content_id:this.props.post_object._id
                                                        }
                                                    })

                                                    this.toggle_like()
                                                }}
                                                style={styles.like_container}
                                            >
                                                <Text style={{backgroundColor:this.state.user_liked ? "white":"red"}}>
                                                    {this.state.likes_count}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    }}
                                </Mutation>          
                            )                          
                            }
                        }                  
                    </Query>
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

            </TouchableOpacity>
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
    }

})

export default ContentCaptionBox
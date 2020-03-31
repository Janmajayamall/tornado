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
import HyperLinkText from "./../text/hyper_link_text"

//importing graphql queries
import {
    CREATE_LIKE,
    UNLIKE_CONTENT,
    GET_USER_INFO,
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

//importing helpers
import {
    constants,
    get_relative_time_ago
} from "./../../helpers/index"




const window = Dimensions.get('window')
class ContentBox extends React.PureComponent {

    static propTypes = {
        post_object:PropTypes.object,
        om_feed:PropTypes.bool,
        componentId:PropTypes.any
    }

    constructor(props){

        super(props)

        this.state={
            img_width:window.width,
            img_height:window.width*1.2,
        }
    }

    // componentDidMount(){
    //     console.log("rendered: ContentBox")
    // }

    navigate_to_comment_screen = () => {
        Navigation.push(this.props.componentId, {
            component: {
                name: COMMENT_SCREEN,
                passProps: {
                    post_id:this.props.post_object._id,
                    query_type:constants.comment_list_query_type.comment_query
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
            <View style={styles.main_container}>

                <View style={styles.user_content_container}>
                    <AvatarTextPanel
                        user_object={this.props.post_object.creator_info}
                        panel_type={constants.avatar_text_panel_type.user}
                    />
                </View>

                {/* room list container */}
                <TouchableOpacity 
                    style={styles.shared_to_name_container}
                    onPress={this.navigate_to_room_list}
                >
                    <Text 
                        style={styles.shared_to_name_text}
                        numberOfLines={1}
                    >
                        {`${this.generate_room_ids_name()}`}
                    </Text>
                </TouchableOpacity>

                {/* post image container */}
                {

                    this.props.post_object.image ? 

                        <View>
                            <AsyncImage
                                image_object={this.props.post_object.image}
                                window_dimensions={window}
                            />
                        </View> : 

                        undefined
                }

                {/* description container */}
                <View style={styles.description_container}>
                    <HyperLinkText style={base_style.typography.small_font_paragraph}>
                        {this.props.post_object.description}
                    </HyperLinkText>
                    <Text style={[base_style.typography.small_font, {fontStyle:"italic", alignSelf:"flex-end"}]}>
                        {`about ${get_relative_time_ago(this.props.post_object.timestamp)}`}
                    </Text>
                </View>
                

                {/* comment and like */}
                <View style={styles.like_comment_main_container}>
                    <Query query={GET_USER_INFO}>
                        {({loading, error, data})=>{

                            //getting user_id
                            const {user_id} = data ? data.get_user_info : {}
                            
                            return (
                                <Mutation 
                                    mutation={this.props.post_object.user_liked ? UNLIKE_CONTENT : CREATE_LIKE}
                                    update={(cache, {data})=>{
                                        
                                        const {get_room_posts_user_id} = cache.readQuery({
                                            query:GET_ROOM_FEED,
                                            variables:{
                                                limit:5
                                            }
                                        })
                                        
                                        //getting toggle like result
                                        const toggle_result = data[`${Object.keys(data)[0]}`]
                                    
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
                                    
                                        this.setState({
                                            user_liked:!this.state.user_liked,
                                            likes_count:this.state.user_liked ? this.state.likes_count-1 : this.state.likes_count+1
                                        })
                                    
                                    }}

                                >
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

                                                    // this.setState({
                                                    //     user
                                                    // })
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

                <View style={[styles.horizontal_line, this.props.on_feed ? {marginBottom:15} : {}]}/>
                
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
        paddingLeft:10,
        paddingRight:10,
        marginTop:5
    },
    shared_to_name_text:{
        ...base_style.typography.small_header,
        // fontStyle:"italic",
        // textDecorationLine:"underline"
    },
    description_container:{
        width:"100%",
        paddingLeft:10,
        paddingRight:10,
        marginTop:5
    }

})

export default ContentBox



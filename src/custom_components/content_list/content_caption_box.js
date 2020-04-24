import React, {useMemo} from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Dimensions,
    Image,
    TouchableOpacity,    
    SafeAreaView,
    TextInput
} from 'react-native'
import PropTypes from 'prop-types'
import {Navigation} from "react-native-navigation"
import { 
    Mutation, 
    Query, 
    withApollo
 } from "react-apollo";
import base_style from "./../../styles/base"
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from "react-native-modal"


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
    get_relative_time_ago,
    delete_post_apollo,
    report_post_apollo
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
            //for like functionality
            user_liked:false,
            likes_count:2
        }

        this.state = {

            report_reason_text:"",

            //model visibility
            is_model_visible:false,
            reporting_modal_visible:false,
            thank_you_modal_visible:false  
        }

    }


    navigate_to_comment_screen = () => {
        navigation_push_to_screen(this.props.componentId, {
            screen_name: COMMENT_SCREEN, 
            props:{
                post_id:this.props.post_object._id,
                query_type:constants.comment_list_query_type.caption_query
            },
            options: {
                bottomTabs:{
                    visible:false
                }
            }
        })

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


    choose_modal_display = () => {

        if(this.state.reporting_modal_visible){
            return(
                <View
                style={styles.modal_wrapper_reporting}
                >
                    <Text
                        style={[base_style.typography.small_font, {color:"#000000", paddingBottom:10}]}
                    > 
                        Why are you reporting this post?
                    </Text>
                    <TextInput
                        placeholder={"Your reason please"}
                        placeholderTextColor={base_style.typography.font_colors.text_input_placeholder}
                        multiline={true}
                        numberOfLines={5}
                        style={[base_style.typography.small_font, {height:window.height*0.4, color:"#000000"}]}
                        value={this.state.report_reason_text}
                        onChangeText={(val)=>{
                            if(val.length<=constants.input_limits.reporting){
                                this.setState({
                                    report_reason_text:val
                                })
                            }
                        }}
                    />
                    <Text 
                        style={[base_style.typography.small_font, {color:"#00acee", padding:5}]}
                        onPress={()=>{

                            if(this.state.report_reason_text.trim()===""){
                                return
                            }

                            report_post_apollo(this.props.client, this.props.post_object._id, this.state.report_reason_text.trim())
                            this.setState({
                                reporting_modal_visible:false,                                
                                thank_you_modal_visible:true                                                                 
                            })
                        }}
                    >
                        Done
                    </Text>
                </View>
            )
        }else if(this.state.thank_you_modal_visible){
            return(
                <View
                    style={styles.modal_wrapper}
                >
                    <Text style={[base_style.typography.medium_font, {color:"#000000", paddingBottom:10}]}>
                        Thank you for reporting!
                    </Text>
                    <Text style={[base_style.typography.small_font, {color:"#000000"}]}>
                        We will review the post and take appropriate actions within 24 Hours.
                    </Text>
                    <Text
                        style={[base_style.typography.small_font, {color:"#00acee", padding:5}]}
                        onPress={()=>{
                            this.setState({
                                is_model_visible:false,
                                reporting_modal_visible:false,
                                thank_you_modal_visible:false
                            })
                        }}                        
                    >
                        Okay!
                    </Text>
                </View>
            )
        }else{
            return(
                <View
                    style={styles.modal_wrapper}
                >
                    {
                        this.props.post_object.is_user?
                            <View style={styles.modal_row}>
                                <Text 
                                    style={[base_style.typography.small_font, {color:"#00acee", padding:5}]}
                                    onPress={this.handle_post_delete}
                                >
                                    Delete
                                </Text>
                            </View>:
                            undefined
                    }
                    {
                        !this.props.post_object.is_user?
                            <View style={styles.modal_row}>
                                <Text 
                                    style={[base_style.typography.small_font, {color:"#00acee", padding:5}]}
                                    onPress={()=>{                                        
                                        this.setState({
                                            reporting_modal_visible:true,
                                            thank_you_modal_visible:false
                                        })
                                    }}
                                >
                                    Report
                                </Text>
                            </View>:
                            undefined
                    }
                </View>
            )
        }

    }

    
    show_bottom_modal = () => {
        
        return(
            <Modal
                isVisible={this.state.is_model_visible}
                swipeDirection="down"
                onSwipeComplete={()=>{                    
                    this.setState({
                        is_model_visible:false,
                        reporting_modal_visible:false,
                        thank_you_modal_visible:false
                    })
                }}
                onBackdropPress={()=>{
                    this.setState({
                        is_model_visible:false,
                        reporting_modal_visible:false,
                        thank_you_modal_visible:false
                    })
                }}
                style={styles.modal_view}
            >               
                {
                    this.choose_modal_display()
                }
            </Modal>
        )
        
    }

    handle_post_delete = async() => {
        const result = delete_post_apollo(this.props.client, this.props.post_object)
        this.setState({
            is_model_visible:false
        })

    }

    render(){
        return(
            <View 
                style={styles.main_container}
            
            >
                {/* room list container */}
                <View style={styles.icon_room_name_container}>
                    <TouchableOpacity 
                        style={[styles.shared_to_name_container, {width:"90%"} ]}
                        onPress={this.navigate_to_room_list}
                    >
                        <Text 
                            style={styles.shared_to_name_text}
                            numberOfLines={1}
                        >
                            {`${this.generate_room_ids_name()}`}
                        </Text>
                    
                    </TouchableOpacity>
                    {/* menu icon container */}
                    <TouchableOpacity 
                        style={styles.menu_icon_container}
                        onPress={()=>{
                            //making the modal visible
                            this.setState({
                                is_model_visible:true
                            })
                        }}
                    >
                        <MaterialCommunityIcons
                            name={"dots-vertical"}
                            size={base_style.icons.icon_size}
                            color={base_style.color.icon_not_selected}
                        />  
                    </TouchableOpacity>
                </View>

                {/* avatar panel */}
                <View style={styles.user_content_container}>
                    <AvatarTextPanel
                        user_object={this.props.post_object.creator_info}
                        panel_type={constants.avatar_text_panel_type.user}
                        componentId={this.props.componentId}
                        avatar_navigate_user_profile={this.props.avatar_navigate_user_profile}
                        is_user={this.props.post_object.is_user}
                    />
                </View>

                {/* displaying the post image */}
                <View>
                    <AsyncImage
                        image_object={this.props.post_object.image}
                        window_dimensions={window}
                    />
                </View>

                {/* time & number of likes */}
                <View style={styles.description_container}>
                    <Text style={styles.timestamp_text}>
                        {`posted ${get_relative_time_ago(this.props.post_object.timestamp)}`}
                    </Text>
                </View>

                {/* comment and likes count */}
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
                                    limit:constants.apollo_query.pagination_limit
                                }
                            })
                            
                            //getting toggle like result
                            const toggle_result = data.toggle_like
                            
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
                                    limit:constants.apollo_query.pagination_limit
                                },
                                data:{                                            
                                    get_room_posts_user_id:updated_get_room_posts
                                }
                            })
                        
                        }}
                        onError={(e)=>{
                            return
                        }}
                    >
                        {(toggle_like)=>{ 
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
                                        toggle_like({
                                            variables:variables
                                        })

                                    }}
                                    style={styles.like_container}
                                >                                        
                                        {
                                            this.props.post_object.user_liked ?
                                                <Icon name="heart" size={base_style.icons.icon_size} color="#900"/>  :
                                                <Icon name="hearto" size={base_style.icons.icon_size} color={base_style.color.icon_not_selected}/>          
                                        }                                                                                                                      
                                </TouchableOpacity>                                       
                            )
                        }}
                    </Mutation>          
                    <View style={styles.likes_count_container}>
                        <Text style={[base_style.typography.small_font, {alignSelf:"center", color:base_style.color.icon_not_selected}]}>
                            {`${this.props.post_object.likes_count} ${this.props.post_object.likes_count===1?"like":"likes"}`}
                        </Text>   
                    </View>
                    <TouchableOpacity style={styles.comment_container}
                        onPress={()=>{
                            if(!this.props.on_feed){
                                
                            }else{
                                this.navigate_to_comment_screen()
                            }
                        }}
                    >                        
                        <Icon name="team" size={base_style.icons.icon_size} color={base_style.color.icon_not_selected}/> 
                        <Text style={[base_style.typography.small_font, {alignSelf:"center", paddingLeft:5, color:base_style.color.icon_not_selected}]}>
                            Caption this
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
                                        key={object._id}
                                    />
                                )
                            }) :
                            undefined
                        }
                </View>
                
                {/* generating the modal box */}
                {
                    this.show_bottom_modal()
                }
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
    },
    user_content_container:{
        
    },
    like_comment_main_container:{
        flexDirection:"row",
        justifyContent:"center",
        marginTop:10,
        marginBottom:15
    },
    like_container:{
        width:"20%",
        justifyContent:"flex-end",
        alignItems:"center",
        flexDirection:"row"
    },
    comment_container:{
        width:"50%",
        flexDirection:"row",
        justifyContent:"center"        
    },
    likes_count_container:{
        width:"30%",
        // justifyContent:"flex-start",
        // alignItems:"flex-start",
        flexDirection:"row",
        paddingLeft:5
    },
    shared_to_name_container:{        
        paddingLeft:10,
        // paddingRight:10,
        marginTop:20,
        marginBottom:10,
        // flexDirection:"row"
        // backgroundColor:base_style.color.primary_color_lighter
    },
    menu_icon_container:{
        marginTop:20,
        marginBottom:10,
        width:"10%",
        alignItems:"center",
        justifyContent:"center"
    },
    icon_room_name_container:{
        flexDirection:"row"
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
    },
    timestamp_text:{
        ...base_style.typography.small_font, 
        ...base_style.typography.font_colors.low_emphasis,
        alignSelf:"flex-end"
    },
    modal_view:{
        justifyContent: 'flex-end',
        margin: 0,        
    },
    modal_row:{
        justifyContent:"center",
        alignItems:"center",
        
    },
    modal_wrapper:{
        backgroundColor:base_style.color.secondary_color,
        padding:20
    },
    modal_wrapper_reporting:{
        backgroundColor:base_style.color.secondary_color,
        padding:20
    }
})

export default withApollo(ContentCaptionBox)
import React from "react"
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    TouchableHighlight,
    Keyboard
} from "react-native"


import ProfileImage from "./../image/profile_image"
import PropTypes from "prop-types"
import base_style from "../../styles/base"
import HyperLinkText from "../../custom_components/text/hyper_link_text"
import VotingPanel from "./voting_panel"

//importing helpers
import {
    constants,
    get_relative_time_ago
} from "./../../helpers/index"

//import screens and navigation functions
import{
    PROFILE_SCREEN
} from "./../../navigation/screens"
import {
    navigation_push_to_screen
} from "./../../navigation/navigation_routes/index"

const window = Dimensions.get("window")

class AvatarTextPanel extends React.PureComponent{

    static propTypes =  {
        user_object:PropTypes.object,
        panel_type:PropTypes.string,

        //if panel_type is comment_display, then comment is required
        comment:PropTypes.string,

        //if panel_type is comment_input, then create_comment_func is required
        create_comment_func:PropTypes.func,

        //if panel_type is caption, then caption_object,caption_index, feed_screen_caption are required
        caption_object:PropTypes.object,
        caption_index:PropTypes.any,
        feed_screen_caption:PropTypes.bool,

        //if panel_type is caption_input, then create_caption_func is required
        create_caption_func:PropTypes.func,

        //for navigating to another screen
        componentId:PropTypes.any,

        //clickable
        avatar_navigate_user_profile:PropTypes.bool
    }

    constructor(props){
        super(props)
        this.state={
            comment_text_input:"",
            
        }
    }
    
    // generating text panel on the basis of value of panel_type
    generate_panel = () => {

        if (this.props.panel_type===constants.avatar_text_panel_type.user){
            return(
                <View style={styles.user_description_container}>
                    <View>
                            <Text style={base_style.typography.small_header}>
                                {this.props.user_object.username}
                            </Text>
                        </View>
                    <Text style={[base_style.typography.small_font, {fontStyle:"italic"}]}>
                        {this.props.user_object.three_words} 
                    </Text>
                </View>
            )
        }

        if(this.props.panel_type===constants.avatar_text_panel_type.comment_display){
            return(
                <View>
                    <HyperLinkText style={base_style.typography.small_font}>
                        {this.props.comment}
                    </HyperLinkText>
                </View>
            )
        }
        
        if(this.props.panel_type===constants.avatar_text_panel_type.comment_input){
            return(
                <View style={styles.input_text_parent_container}>
                    <View style={styles.input_text_container}>
                        <TextInput 
                                style={styles.comment_text_input}
                                multiline={true}
                                scrollEnabled={true}
                                value={this.state.comment_text_input}
                                onChangeText={(val)=>{
                                    this.setState({comment_text_input:val})
                                }}
                                placeholder={"Add a new comment..."}
                                placeholderTextColor={"white"}
                        />
                    </View>
                    <TouchableOpacity 
                        style={styles.post_button_container}
                        onPress={()=>{
                            if(this.state.comment_text_input.trim()===""){
                                console.log("Please enter comment first")
                            }else{
                                this.props.create_comment_func(this.state.comment_text_input)
                                this.setState({comment_text_input:""})
                                Keyboard.dismiss()
                            }
                        }}
                    >
                        <Text style={styles.post_button_text}>
                            Post
                        </Text>
                    </TouchableOpacity>
                    
                </View>
            )
        }

        if(this.props.panel_type===constants.avatar_text_panel_type.caption){
            return(
                <View style={styles.user_description_container}>
                    <View style={styles.caption_text_container}>
                            <Text style={base_style.typography.small_header}>
                                {`${this.props.user_object.username}`}                            
                            </Text>
                            <Text style={[base_style.typography.small_font, {...base_style.typography.font_colors.low_emphasis, alignSelf:"flex-end"}]}>
                                {`${this.props.caption_index===0?"Top rated" : ""}`}
                            </Text>
                    </View> 
                    <Text style={base_style.typography.small_font}>
                        {this.props.caption_object.description}
                    </Text>
                    <Text style={[base_style.typography.small_font, {...base_style.typography.font_colors.low_emphasis, alignSelf:"flex-end"}]}>
                            {`${get_relative_time_ago(this.props.caption_object.timestamp)}`}
                        </Text>
                    {
                        !this.props.feed_screen_caption ? 
                            <View style={styles.vote_container}>
                                <VotingPanel
                                    caption_object={this.props.caption_object}
                                />
                            </View>:
                            undefined
                    }
                     
                    
                </View>
            )
        }

        if(this.props.panel_type===constants.avatar_text_panel_type.caption_input){
            return(
                <View style={styles.input_text_parent_container}>
                    <View style={styles.input_text_container}>
                        <TextInput 
                                style={styles.comment_text_input}
                                multiline={true}
                                scrollEnabled={true}
                                value={this.state.caption_text_input}
                                onChangeText={(val)=>{
                                    this.setState({caption_text_input:val})
                                }}
                                placeholder={"Describe the image in your words!"}
                                placeholderTextColor={"white"}
                        />
                    </View>
                    <TouchableOpacity 
                        style={styles.post_button_container}
                        onPress={()=>{
                            if(this.state.caption_text_input.trim()===""){
                                console.log("Please enter the caption")
                            }else{
                                this.props.create_caption_func(this.state.caption_text_input)
                                this.setState({caption_text_input:""})
                                Keyboard.dismiss()
                            }
                        }}
                    >
                        <Text>Post</Text>
                    </TouchableOpacity>
                    
                </View>
            )
        }

    
    }

    // navigate to user_profile if panel_type is "USER"
    navigate_to_user_profile = () => {
        navigation_push_to_screen(this.props.componentId, {
            screen_name:PROFILE_SCREEN,
            props:{
                is_user:false,
                profile_user_info:this.props.user_object
            }
        })
    }

    render(){

        return(
            <TouchableOpacity
                style={styles.main_container}
                disabled={!this.props.avatar_navigate_user_profile}
                onPress={this.navigate_to_user_profile}
            >
                <View style={styles.user_profile_pic_container}>                    
                    <ProfileImage
                            width={window.width*0.10}
                            image_object={this.props.user_object.avatar}
                            default_avatar={this.props.user_object.default_avatar}
                    />             
                </View>
                <View style={styles.content_panel_container}>
                    {
                        this.generate_panel()
                    }   
                </View>
                         
            </TouchableOpacity>
        )

    }
}

const styles = StyleSheet.create({
    main_container:{
        flexDirection:"row",
        paddingRight:10,
        width:"100%",
        // backgroundColor:base_style.color.primary_color_lighter
    },
    user_profile_pic_container:{
        width:'15%',
        justifyContent:"flex-start",
        padding:5,
        borderRadius:2
    },
    content_panel_container:{
        width:'85%',
        padding:5
    },
    user_description_container:{
        flexDirection:'column',
    },
    comment_display_container:{

    },
    input_text_parent_container:{
        flexDirection:"row"
    },
    input_text_container:{
        width:"85%",
        height:"100%",
        // borderRightColor:base_style.color.primary_color_lighter,
        // borderLeftColor:base_style.color.primary_color_lighter,
        // borderRightWidth:2,
        // borderLeftWidth:2,
        // paddingLeft:5,
        paddingRight:5
    },
    post_button_container:{
        width:"15%",
        justifyContent:"center",
        alignItems:"center"
    },
    post_button_text:{
        ...base_style.typography.small_font,
    },
    comment_text_input:{
        width:"100%",
        ...base_style.typography.small_font
    },
    vote_container:{
        flexDirection:"row",
    },
    caption_text_container:{
        flexDirection:"row", justifyContent:"space-between"
    }
})

export default AvatarTextPanel

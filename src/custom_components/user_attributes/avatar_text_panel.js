import React from "react"
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    TouchableHighlight,
    Keyboard,
    TouchableWithoutFeedback
} from "react-native"
import Menu, { MenuItem, MenuDivider, Position } from "react-native-enhanced-popup-menu";


import ProfileImage from "./../image/profile_image"
import PropTypes from "prop-types"
import base_style from "../../styles/base"
import HyperLinkText from "../../custom_components/text/hyper_link_text"
import VotingPanel from "./voting_panel"

//importing helpers
import {
    constants,
    get_relative_time_ago,
    delete_comment_apollo,
    delete_caption_apollo
} from "./../../helpers/index"

//import screens and navigation functions
import{
    PROFILE_SCREEN
} from "./../../navigation/screens"
import {
    navigation_push_to_screen
} from "./../../navigation/navigation_routes/index"
import { withApollo } from "react-apollo";

const window = Dimensions.get("window")

class AvatarTextPanel extends React.PureComponent{

    static propTypes =  {
        user_object:PropTypes.object,
        panel_type:PropTypes.string,
        is_user:PropTypes.bool,

        //if panel_type is comment_display, then comment is required
        comment_object:PropTypes.object,

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

        //refs
        this.drop_down_menu_ref = null
        this.generate_panel_ref = React.createRef()
    }
    
    // generating text panel on the basis of value of panel_type
    generate_panel = () => {

        if (this.props.panel_type===constants.avatar_text_panel_type.user){
            return(
                <View style={styles.user_description_container}>
                    <View>
                        <Text numberOfLines={1} style={base_style.typography.small_header}>
                            {this.props.user_object.username}
                        </Text>
                    </View>
                    <Text numberOfLines={1} style={[base_style.typography.small_font, {fontStyle:"italic"}]}>
                        {this.props.user_object.three_words} 
                    </Text>
                </View>
            )
        }

        if(this.props.panel_type===constants.avatar_text_panel_type.comment_display){
            return(
                <View style={styles.user_description_container}>
                    <View style={styles.caption_text_container}>
                            <Text style={base_style.typography.small_header}>
                                {`${this.props.user_object.username}`}                            
                            </Text>
                    </View> 
                    <HyperLinkText 
                        style={base_style.typography.small_font}
                        trim={true}
                        numberOfLines={3}
                    >
                        {this.props.comment_object.comment_body}
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
                                placeholderTextColor={base_style.typography.font_colors.text_input_placeholder}
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
                    <HyperLinkText 
                        style={base_style.typography.small_font}
                        trim={true}
                        numberOfLines={3}    
                    >
                        {this.props.caption_object.description}
                    </HyperLinkText>
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
                                placeholder={"Caption this!"}
                                placeholderTextColor={base_style.typography.font_colors.text_input_placeholder}
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
                        <Text style={styles.post_button_text}>Post</Text>
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
                is_user:this.props.is_user,
                user_id:this.props.user_object.user_id
            }
        })
    }

    on_avatar_panel_pressed = () => {
        //navigate to profile screen
        if(this.props.avatar_navigate_user_profile===true){
            this.navigate_to_user_profile()
        }
    }

    on_avatar_panel_long_pressed = () => {
        
        //comment display && is_user, then give option to delete
        if((this.props.panel_type===constants.avatar_text_panel_type.comment_display || this.props.panel_type===constants.avatar_text_panel_type.caption)
             && this.props.is_user){
                this.show_drop_down_menu()
        }
    }

    show_drop_down_menu = () => {
       this.drop_down_menu_ref.show(this.generate_panel_ref.current,Position.BOTTOM_CENTER);
    }

    handle_delete = () => {
        console.log('aq')
        //handling commment
        if(this.props.panel_type===constants.avatar_text_panel_type.comment_display && this.props.is_user){
            delete_comment_apollo(this.props.client, this.props.comment_object)
        }

        //handling caption
        if(this.props.panel_type===constants.avatar_text_panel_type.caption && this.props.is_user){
            delete_caption_apollo(this.props.client, this.props.caption_object)
        }

        //hide the dropdown menu
        this.drop_down_menu_ref.hide()

        return

    }

    handle_comment_delete = () => {

    }

    handle_caption_delete = () => {

    }

    render(){

        return(
            <TouchableWithoutFeedback
                onPress={this.on_avatar_panel_pressed}
                onLongPress={this.on_avatar_panel_long_pressed}
            >
                <View style={styles.main_container}>
                    <View style={styles.user_profile_pic_container}>                    
                        <ProfileImage
                                width={window.width*0.10}
                                image_object={this.props.user_object.avatar}
                                default_avatar={this.props.user_object.default_avatar}
                        />             
                    </View>
                    <View 
                        style={styles.content_panel_container}
                        ref={this.generate_panel_ref}
                        >
                        {
                            this.generate_panel()
                        }   
                    </View>

                    {/* dropdown menu for delete */}
                    <Menu
                        ref={(ref)=>{this.drop_down_menu_ref=ref}}
                    >
                        <MenuItem onPress={this.handle_delete}>Delete</MenuItem>
                    </Menu>
                </View>
                         
            </TouchableWithoutFeedback>
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
        flexDirection:"row", 
        justifyContent:"space-between"
    }
})

export default withApollo(AvatarTextPanel)

import React from "react"
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Dimensions,
    StyleSheet
} from "react-native"

import Avatar from "./../image/profile_image"
import PropTypes from "prop-types"
import base from "../../styles/base"

const window = Dimensions.get("window")

class AvatarTextPanel extends React.PureComponent{

    static propTypes =  {
        is_description:PropTypes.bool,
        username:PropTypes.string,
        description:PropTypes.string,
        avatar:PropTypes.object,
        create_comment_func:PropTypes.func,
        user_id:PropTypes.string,
        content_id:PropTypes.string,
        content_type:PropTypes.string
    }

    constructor(props){
        super(props)
        this.state={
            comment_text_input:"",
            
        }
    }
    
    generate_content_holder = (is_description=false) => {
    
        if (is_description==true){
            return(
    
                <View style={styles.user_description_container_child}>
    
                        <View>
                            <Text style={base_style.typography.small_header}>
                                {this.props.username}
                            </Text>
                        </View>
    
                        <View>
                            <Text style={base_style.typography.small_font}>
                                {this.props.description}
                            </Text>
                        </View>
    
                </View>
            )
        }
    
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
                            this.props.create_comment_func({
                                    content_id:this.props.content_id,
                                    content_type:this.props.content_type,
                                    comment_body:this.state.comment_text_input                                    
                                })
                            this.setState({comment_text_input:""})
                        }
                    }}
                >
                    <Text>Post</Text>
                </TouchableOpacity>
                
            </View>
        )
    
    }

    render(){

        return(
            <View style={styles.main_container}>
                <View style={styles.user_profile_pic_container}>                    
                    <Avatar
                            width={window.width*0.18}
                            image_object={this.props.avatar}
                    />                 
                </View>

                <View style={styles.user_description_container}>
                    {
                        this.generate_content_holder(this.props.is_description)
                    }
                </View>
            </View>
        )

    }
}

const styles = StyleSheet.create({
    main_container:{
        flexDirection:"row",
        padding:5,

    },
    user_profile_pic_container:{
        width:'20%',
        justifyContent:"flex-start",
        padding:5,
        borderRadius:2
    },
    user_description_container:{
        width:'80%',
        padding:5
    },
    user_description_container_child:{
        flexDirection:'column',
    },
    input_text_parent_container:{
        width:"80%",
        flexDirection:"row"
    },
    input_text_container:{
        width:"90%",
        height:"100%",
    },
    post_button_container:{
        width:"10%"
    },
    comment_text_input:{
        width:"100%",
        ...base.typography.small_font

    }
})

export default AvatarTextPanel

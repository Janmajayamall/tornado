import React, {useMemo} from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Dimensions,
    Image,
    TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'
import {Navigation} from "react-native-navigation"

//customer components
import AsyncImage from '../image/async_image'
import AvatarTextPanel from "./../user_attributes/avatar_text_panel"

import {get_scaled_image_size} from "./../../helpers"


// import screens
import {COMMENT_SCREEN} from "./../../navigation/screens"

defaultContent={
    user_profile:{
        avatar:'https://www.nowrunning.com/content/Artist/Zendaya/banner.jpg',
        creative_name:'JayZendaya',
    },
    trend:['olympics'],
    posted_image:'https://www.rollingstone.com/wp-content/uploads/2018/10/colin-Kaepernick-just-do-it-nike-ad-2018.jpg?resize=1800,1200&w=450',
    likes:10,
    description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
}

const window = Dimensions.get('window')
class ContentBox extends React.PureComponent {

    static propTypes = {
        post_object:PropTypes.object,
        om_feed:PropTypes.bool
    }

    constructor(props){

        super(props)

        this.state={
            img_width:window.width,
            img_height:window.width*1.2
        }
        this.load_async_image_dims(this.props.post_object.img_url)
    }

    // componentDidMount(){
    //     console.log("rendered: ContentBox")
    // }

    load_async_image_dims = async (img_url) => {
        
        Image.getSize(img_url, (width, height) => {

            if (window.width){
                this.setState({
                    img_width: window.width,
                    img_height: height * (window.width / width),
                }, this.props.source)
            }
        });

    }

    navigate_to_comment_screen = () => {
        
        Navigation.push(this.props.componentId, {
            component: {
                name: COMMENT_SCREEN,
                passProps: {
                    post_object:this.props.post_object
                },
                options: {

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

    render(){
        return(
            <View style={styles.main_container}>

                {

                    this.props.post_object.img_url ? 

                        <View>
                            <AsyncImage
                                source={this.props.post_object.img_url}
                                width={this.state.img_width}
                                height={this.state.img_height}
                            />
                        </View> : 

                        undefined
                }

                <View style={styles.user_content_container}>
                    <AvatarTextPanel
                        avatar={this.props.post_object.creator_info.avatar}
                        username={this.props.post_object.creator_info.username}
                        description={this.props.post_object.description}
                        is_description={true}
                    />
                </View>

                {/* comment and like */}
                <View style={styles.like_comment_main_container}>
                    <View style={styles.like_container}>
                        <Text>
                            Like
                        </Text>
                    </View>
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
    }

})

export default ContentBox
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
import { 
    Mutation, Query
 } from "react-apollo";

//customer components
import AsyncImage from '../image/async_image'
import AvatarTextPanel from "./../user_attributes/avatar_text_panel"

//importing graphql queries
import {
    CREATE_LIKE,
    UNLIKE_CONTENT,
    GET_LOCAL_USER_INFO
} from "./../../apollo_client/apollo_queries/index"


// import screens
import {COMMENT_SCREEN} from "./../../navigation/screens"


const window = Dimensions.get('window')
class ContentBox extends React.PureComponent {

    static propTypes = {
        post_object:PropTypes.object,
        om_feed:PropTypes.bool,
        toggle_post_like:PropTypes.func,
        componentId:PropTypes.any
    }

    constructor(props){

        super(props)

        this.state={
            img_width:window.width,
            img_height:window.width*1.2,

            //for like functionality
            user_liked:this.props.post_object.user_liked,
            likes_count:this.props.post_object.likes_count
        }
    }

    // componentDidMount(){
    //     console.log("rendered: ContentBox")
    // }

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

    render(){
        return(
            <View style={styles.main_container}>

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
                    <Query query={GET_LOCAL_USER_INFO}>
                        {({loading, error, data})=>{
                            const user_info = data.user_info

                            //TODO: do validating for token and user_id and only render the like button if the user is logged in

                            return (
                                <Mutation mutation={this.state.user_liked ? UNLIKE_CONTENT : CREATE_LIKE}>
                                    {(create_like, {})=>{    
                                        return(
                                            <TouchableOpacity 
                                                onPress={()=>{
                                                    create_like({
                                                        variables:{
                                                            user_id:user_info.user_id,
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
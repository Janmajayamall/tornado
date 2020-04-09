
import React from "react"
import { 
    Dimensions,
    StyleSheet
} from "react-native";
import {
    withApollo
} from "react-apollo"
import {Navigation} from "react-native-navigation"

//importing all screens
import { 
    CREATE_POST_ROOM_SELECT_SCREEN,
    CREATE_ROOM_POSTS_SCREEN,
    REGISTER_OTHER_ATT_SCREEN
 } from "../../navigation/screens";
import {
    navigation_push_to_screen
} from "../../navigation/navigation_routes/index"

import PropTypes from "prop-types"
//helpers
import {
    constants
} from "../../helpers/index"

//import create post type screens
import CreateRoomPosts from "./create_room_posts_screen"
import CreateCaptionRoomPosts from "./create_caption_room_posts_screen"

const window = Dimensions.get("window")

class CommonCreatePosts extends React.PureComponent{

    static propsTypes={
        
    }

    constructor(props){
        super(props)

        this.state = {
            create_post_type:constants.create_post_type.room_post,
        }

        //refs
        this.choose_post_image_ref = React.createRef()

        //binding the topBar add post button 
        Navigation.events().bindComponent(this);

        //creating diff create_posts refs
        this.create_room_posts_ref = React.createRef()
        this.create_caption_room_posts_ref = React.createRef()
    }

    //for topBar buttons
    navigationButtonPressed({ buttonId }) {
        
        if(buttonId === "back"){
            Navigation.pop(this.props.componentId)
        }

        if(buttonId === constants.navigation.action_buttons.SHARE_POST){
            console.log(this.state.create_post_type)
            if(this.state.create_post_type===constants.create_post_type.room_caption_post){
                this.create_caption_room_posts_ref.current.create_post_wrapper()
                return
            }else if(this.state.create_post_type===constants.create_post_type.room_post){
                this.create_room_posts_ref.current.create_post_wrapper()
                return
            }
            console.log("ERROR, not able to select which post type it is")
        }

    }  
    
    switch_screen_func = () => {
        if(this.state.create_post_type===constants.create_post_type.room_post){
            this.setState({create_post_type:constants.create_post_type.room_caption_post})
        }else{
            this.setState({create_post_type:constants.create_post_type.room_post})
        }
    }

    render(){

        if(this.state.create_post_type===constants.create_post_type.room_caption_post){
            console.log("idhar heo yeh")
            return(
                <CreateCaptionRoomPosts
                    client={this.props.client}
                    ref={this.create_caption_room_posts_ref}
                    switch_screen_func={this.switch_screen_func}
                    componentId={this.props.componentId}
                />
            )
        }
        
        if(this.state.create_post_type===constants.create_post_type.room_post)
        return(
                <CreateRoomPosts
                    client={this.props.client}
                    ref={this.create_room_posts_ref}
                    switch_screen_func={this.switch_screen_func}
                    componentId={this.props.componentId}
                />
        )

        return(
            <Text>
                Error.........
            </Text>
        )
    }
}

const styles = StyleSheet.create({

})

export default withApollo(CommonCreatePosts)


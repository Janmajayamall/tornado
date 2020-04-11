import React from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Image,
    Dimensions,
    Animated
} from 'react-native'
import PropTypes from "prop-types"
import base_style from "./../../styles/base"

class ProfileImage extends React.PureComponent {
    
    static propsTypes = {
        width:PropTypes.any,
        image_object:PropTypes.object,
        default_avatar:PropTypes.bool
    }

    constructor(props){

        super(props)

        this.state={
            loaded:false,
            image_opacity:new Animated.Value(0)
        }
    }

    on_image_load = () => {
        Animated.timing(this.state.image_opacity, {
            toValue:1,
            duration:250
        }).start()
    }
    
    render(){

        return(
            <View
                style={[styles.main_container,{
                    width:this.props.width, 
                    height:this.props.width,
                    borderRadius:this.props.width/2,
                }]}
            >
                <Animated.Image
                    source={{uri:!this.props.default_avatar?`${this.props.image_object.cdn_url}www/www${this.props.image_object.image_name}`:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSC8zNSl8ANpBEbImwNl2XCd0IHldNyVIZw3i3LI5kydF3bLQhL"}}  
                    style={{
                        width:this.props.width, 
                        height:this.props.width, 
                        borderRadius:this.props.width/2,
                        position:"absolute",
                        opacity:this.state.image_opacity}}
                    // onLoad={this.on_image_load}
                />
            </View>

        )
    }

}

const styles = {
    main_container:{        
        backgroundColor:base_style.color.primary_color_lighter
    },
    posted_image_style:{

    },
    replace_container:{
        backgroundColor:'black',
    }
}

export default ProfileImage


import React from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Image,
    Dimensions
} from 'react-native'
import FastImage from "react-native-fast-image"
import PropTypes from "prop-types"

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
        }
        console.log(this.props, "this is new")
    }

    on_load = () => {
        this.setState({loaded:true})
    }

    render(){

        return(
            <View>
                <Image
                    source={{uri:!this.props.default_avatar?`${this.props.image_object.cdn_url}w/${this.props.image_object.image_name}`:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSC8zNSl8ANpBEbImwNl2XCd0IHldNyVIZw3i3LI5kydF3bLQhL"}}  
                    style={[styles.posted_image_style,this.state.loaded?{width:this.props.width, height:this.props.width, borderRadius:this.props.width/2}:{}]} 
                    onLoad={this.on_load()}
                />
                {
                    this.state.loaded===false ?
                        <View
                            style={[styles.replace_container,{width:this.props.width, height:this.props.width, borderRadius:this.props.width/2, }]}
                        /> :
                        undefined
                }
            </View>
        )
    }

}

const styles = {
    main_container:{
        width:"100%"
    },
    posted_image_style:{

    },
    replace_container:{
        backgroundColor:'#ffffff',
    }
}

export default ProfileImage
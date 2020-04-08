import React, { PureComponent } from 'react'
import {
    View,
    Dimensions,
    Image, 
    Animated
} from 'react-native'
import PropTypes from "prop-types"
import base_style from "./../../styles/base"


class AsyncImage extends PureComponent {
    
    static propsTypes = {
        image_object:PropTypes.object,
        window_dimensions:PropTypes.any
    }

    constructor(props){

        super(props)

        this.state={
            loaded:false,
            image_dimensions:this.calculate_dimensions(),
            image_opacity:new Animated.Value(0)
        }

    }

    calculate_dimensions = () => {
        return({
            width:this.props.window_dimensions.width,
            height:this.props.image_object.height * (this.props.window_dimensions.width/this.props.image_object.width)
        })
    }

    on_image_load = () => {
        Animated.timing(this.state.image_opacity, {
            toValue:1,
            duration:300
        }).start()
    }

    // on_thumbnail_opacity = () => {
    //     console.log(this.props.image_object.image_name, "thumbnal")
    //     Animated.timing(this.state.thumbnail_opacity, {
    //         toValue:1,
    //         duration:250
    //     }).start()
    // }


    render(){

        return(
            <View
                style={[styles.main_container, {width:this.state.image_dimensions.width, height:this.state.image_dimensions.height}]}
            >

                <Animated.Image
                    source={{uri:`${this.props.image_object.cdn_url}/${this.props.image_object.image_name}`}}
                    style={{width:this.state.image_dimensions.width, height:this.state.image_dimensions.height, position:"absolute", opacity:this.state.image_opacity}}
                    onLoad={this.on_image_load}
                />

                {/* <Animated.Image
                    source={{uri:`${this.props.image_object.cdn_url}/filters:quality(1)/${this.props.image_object.image_name}`}}
                    style={{width:this.state.image_dimensions.width, height:this.state.image_dimensions.height, }} 
                    onLoad={this.on_thumbnail_opacity}
                /> */}

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

export default AsyncImage
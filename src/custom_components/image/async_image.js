import React, { PureComponent } from 'react'
import {
    View,
    Dimensions,
    Image
} from 'react-native'
import PropTypes from "prop-types"


class AsyncImage extends PureComponent {
    
    static propsTypes = {
        image_object:PropTypes.object,
        window_dimensions:PropTypes.any
    }

    constructor(props){

        super(props)

        this.state={
            loaded:false,
            image_dimensions:this.calculate_dimensions()
        }

        console.log(this.props.image_object, "image_object")
    }

    calculate_dimensions = () => {
        return({
            width:this.props.window_dimensions.width,
            height:this.props.image_object.height * (this.props.window_dimensions.width/this.props.image_object.width)
        })
    }

    on_load = () => {
        this.setState({loaded:true})
    }

    //TODO: add blur load vision for this later

    render(){

        return(
            <View>

                <Image
                    source={{uri:`${this.props.image_object.cdn_url}/w${this.props.image_object.image_name}`}}
                    style={[styles.posted_image_style, this.state.loaded?{width:this.state.image_dimensions.width, height:this.state.image_dimensions.height}:{}]} 
                    onLoad={this.on_load()}
                />

                {!this.state.loaded ?
                    <View
                        style={[styles.replace_container, {width:this.state.image_dimensions.width, height:this.state.image_dimensions.height}]}
                    /> :
                    undefined
                } 

            </View>
        )
    }

}

const styles = {
    main_container:{
        backgroundColor:"#ffffff"
    },
    posted_image_style:{

    },
    replace_container:{
        backgroundColor:'#ffffff',
    }
}

export default AsyncImage
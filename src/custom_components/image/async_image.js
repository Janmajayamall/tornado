import React, { PureComponent } from 'react'
import {
    View,
    Dimensions,
    Image
} from 'react-native'
import FastImage from "react-native-fast-image"
import PropTypes from "prop-types"

const window = Dimensions.get('window')

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

    }

    // componentDidMount(){
    //     console.log("rendered: AsyncImage")
    // }

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
            <View style={[styles.main_container, {width:this.props.width, height:this.props.height}]}>

                <Image
                    source={{uri:`${this.props.image_object.cdn_url}/${this.props.image_object.image_name}`}}
                    style={[styles.posted_image_style, {width:this.image_dimensions.width, height:this.image_dimensions.height}]} 
                    onLoad={this.on_load}
                />

                {!this.state.loaded ?
                    <View
                        style={[styles.replace_container, {width:this.image_dimensions.width, height:this.image_dimensions.height}]}
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
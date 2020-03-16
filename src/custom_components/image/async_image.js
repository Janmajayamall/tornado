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
        width:PropTypes.any,
        height:PropTypes.any
    }

    constructor(props){

        super(props)

        this.state={
            loaded:false,
        }

    }

    // componentDidMount(){
    //     console.log("rendered: AsyncImage")
    // }

    on_load = () => {
        this.setState({loaded:true})
    }

    //TODO: add blur load vision for this later

    render(){

        return(
            <View style={[styles.main_container, {width:this.props.width, height:this.props.height}]}>

                <FastImage
                    source={{uri:this.props.source}}
                    style={[styles.posted_image_style, {width:this.props.width, height:this.props.height}]} 
                    onLoad={this.on_load}
                    // resizeMode={"contain"}
                />

                {!this.state.loaded ?
                    <View
                        style={styles.replace_container}
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
        width:'100%',
    }
}

export default AsyncImage
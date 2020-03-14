import React from 'react'
import {
    View,
    Dimensions,
    Image
} from 'react-native'
import FastImage from "react-native-fast-image"
import PropTypes from "prop-types"

const window = Dimensions.get('window')

class AsyncImage extends React.Component {
    
    static propsTypes = {
        width:PropTypes.any,
        height:PropTypes.any
    }

    constructor(props){

        super(props)

        this.state={
            loaded:false,
            width:window.width,
            main_container_width:this.props.width,
            main_container_height:this.props.height*1.2
        }

    }

    componentDidMount() {
        Image.getSize(this.props.source, (width, height) => {

            if (window.width){
                this.setState({
                    width: window.width,
                    height: height * (window.width / width),
                    main_container_height:  height * (window.width / width),
                    main_container_width: window.width
                })
            }
        });

        
    }

    on_load = () => {
        this.setState({loaded:true})
    }

    //TODO: add blur load vision for this later

    render(){

        return(
            <View style={[styles.main_container, {width:this.state.main_container_width, height:this.props.main_container_height}]}>

                <Image
                    source={{uri:this.props.source}}
                    style={[styles.posted_image_style, {width:this.state.width, height:this.state.height}]} 
                    onLoad={this.on_load}
                    resizeMode={"contain"}
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
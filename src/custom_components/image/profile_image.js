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

class Avatar extends React.PureComponent {
    
    static propsTypes = {
        
    }

    constructor(props){

        super(props)

        this.state={
            loaded:false,
            width:1
        }

    }

    on_load = () => {
        this.setState({loaded:true})
    }

    on_layout = (e) => {
        this.setState({
            width:e.nativeEvent.layout.width,
            height:e.nativeEvent.layout.height
        })
    }

    render(){

        return(
            <View onLayout={this.on_layout}>
                <Image
                    source={{uri:this.props.source}}
                    resizeMode={'cover'}
                    style={{...styles.posted_image_style, borderRadius:this.state.width/2}} 
                    onLoad={this.on_load}
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
    posted_image_style:{
        width:"100%",
        aspectRatio:1
    },
    replace_container:{
        backgroundColor:'#ffffff',
        width:'100%',
    }
}

export default Avatar
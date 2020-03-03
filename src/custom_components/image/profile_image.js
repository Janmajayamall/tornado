import React from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Image,
    Dimensions
} from 'react-native'


class Avatar extends React.Component {
    
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

            </View>
        )
    }

}

const styles = {
    posted_image_style:{
        width:"100%",
        aspectRatio:1
    },
}

export default Avatar
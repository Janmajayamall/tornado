import React from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Image,
    Dimensions
} from 'react-native'

const window = Dimensions.get('window')

class AsyncImage extends React.Component {
    
    static propsTypes = {
        
    }

    constructor(props){

        super(props)

        this.state={
            loaded:false,
            width:100,
            height:100
        }

    }

    componentDidMount() {
        Image.getSize(this.props.source, (width, height) => {

            if (window.width){
                this.setState({
                    width: window.width,
                    height: height * (window.width / width)
                });
            }
        });
    }

    on_load = () => {
        this.setState({loaded:true})
    }

    render(){

        return(
            <View>

                <Image
                    source={{uri:this.props.source}}
                    style={{...styles.posted_image_style, width:this.state.width, height:this.state.height}} 
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

    },
    replace_container:{
        backgroundColor:'#ffffff',
        width:'100%',
    }
}

export default AsyncImage
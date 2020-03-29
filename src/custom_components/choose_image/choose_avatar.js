import React from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Dimensions,
    FlatList,
    Image,
    TouchableOpacityComponent,
    TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'
import ImagePicker from "react-native-image-crop-picker"
import {
    withApollo
} from "react-apollo"

import base_style from "./../../styles/base"

//import graphql queries/mutation



class ChooseAvatar extends React.PureComponent{

    static propTypes = {
        width:PropTypes.any,
        upload_img_s3:PropTypes.func,
        username:PropTypes.string,
        image_uri:PropTypes.string
    }

    constructor(props){
        super(props)
        this.state={
            image_uri:this.props.image_uri!==undefined?this.props.image_uri:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSC8zNSl8ANpBEbImwNl2XCd0IHldNyVIZw3i3LI5kydF3bLQhL"
        }
        console.log(this.props.image_uri)

    }

    componentDidUpdate(){
        // console.log("rendered: ContentList", this.props.bottom_padding)
    }
    

    crop_image_circle = (image_path) => {
        ImagePicker.openCropper({
            path:image_path,
            cropperCircleOverlay:true,
            includeBase64:true
        }).then(image=>{
            console.log(image)
            const image_uri = `data:${image.mime};base64,${image.data}`
            const image_extension = image.mime.split("/")[1]

            //generating image_obj
            const image_obj = {
                file_mime:image.mime,
                width:image.width,
                height:image.height,
                image_data:image.data,
                file_name:`${this.props.username}_${new Date().toISOString()}.${image_extension}`
            }

            this.props.upload_img_s3(image_obj)

            this.setState({
                image_uri:image_uri
            })
        })
    }

    //dev 
    select_image_from_device = () => {
        ImagePicker.openPicker({
            }).then(image => {                
                this.crop_image_circle(image.path)
            });
    }


    render(){
        return(
            <View style={styles.main_container}>
                <View style={styles.first_container}>
                    {/* display chosen image, initially display default image */}
                    <Image
                        source={{uri:this.state.image_uri}}
                        style={[styles.image_container, {width:this.props.width/2, height:this.props.width/2, borderRadius:this.props.width/4}]}
                    />
                </View>
    
                <TouchableOpacity
                    onPress={this.select_image_from_device}
                    style={styles.second_container}
                >
                    <Text style={styles.choose_image_text}>
                        Choose profile image
                    </Text>
                </TouchableOpacity>

            </View>
        )
    }

}

const styles = StyleSheet.create({
    main_container:{
        width:"100%",
    },
    first_container:{
        justifyContent:"center",
        alignItems:"center"
    },
    image_container:{
        
    },
    second_container:{
        justifyContent:"center",
        alignItems:"center"
    },
    choose_image_text:{
        ...base_style.typography.small_header,
        fontWeight:"normal"
    }
})

export default withApollo(ChooseAvatar)

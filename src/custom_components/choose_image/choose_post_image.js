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
    withApollo, ApolloConsumer
} from "react-apollo"

import base_style from "./../../styles/base"

//import graphql queries/mutation



class ChoosePostImage extends React.PureComponent{

    static propTypes = {
        upload_img_s3:PropTypes.func,
        width:PropTypes.any,

        //if image is already chosen, then pass this
        /*
            image:{
                image_uri:String, 
                height:number,
                width:number
            }
        */
       image:PropTypes.object
    }


    constructor(props){
        super(props)
        this.state={
            image_object: this.props.image ? this.aggregate_call_scaling(this.props.image) : undefined
        }        

    }

    scale_main_view_dimensions = (image_dimensions) => {

        return({
            width: this.props.width,
            height: image_dimensions.height * ((this.props.width)/image_dimensions.width)
        })

    }

    scale_image_dimensions_display = (image_dimensions) => {

        return({
            width: this.props.width*0.8,
            height: image_dimensions.height * ((this.props.width*0.8)/image_dimensions.width)
        })

    }
    
    aggregate_call_scaling = (image) => {

        //getting scaled image dimensions for display
        const scaled_dims = this.scale_image_dimensions_display({width:image.width,height:image.height})
        const scaled_main_view_dims = this.scale_main_view_dimensions({width:image.width,height:image.height})

        return({
            image_uri:image.image_uri,
            image_width:scaled_dims.width,
            image_height:scaled_dims.height,
            main_view_width:scaled_main_view_dims.width,
            main_view_height:scaled_main_view_dims.height               
        })
    }

    //dev 
    select_image_from_device = () => {
        ImagePicker.openPicker({
                includeBase64:true
            }).then(image => {
                const image_uri = `data:${image.mime};base64,${image.data}`

                //generating image_obj
                const image_obj = {
                    file_mime:image.mime,
                    width:image.width,
                    height:image.height,
                    image_data:image.data,
                    image_uri:image_uri                
                }

                this.props.upload_img_s3(image_obj)
            
                this.setState({
                    image_object:this.aggregate_call_scaling({
                        image_uri:image_uri,
                        width:image.width,
                        height:image.height,
                    })
                });
            }).catch(e=>{
                return
            })
    }


    render(){
        return(
            <View>
                {
                    this.state.image_object===undefined?
                    <View/>:
                    <View style={styles.main_container}>
                        <View style={[styles.first_container, {width:this.state.image_object.main_view_width, height:this.state.image_object.main_view_height}]}>
                            {/* display chosen image, initially display default image */}
                            <Image
                                source={{uri:this.state.image_object.image_uri}}
                                style={[styles.image_container, {width:this.state.image_object.image_width, height:this.state.image_object.image_height}]}
                            />
                        </View>
                    </View>
                }
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
        
    }
})

export default ChoosePostImage

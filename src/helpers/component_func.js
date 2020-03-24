import { 
    Image
 } from "react-native";
import moment from "moment"


export const get_scaled_image_size = async(parent_dim=null, img_src=null, reference_height=false) => {

    return new Promise((resolve, reject)=>{

        //checking errors
        errors = {}
        if (parent_dim==null){
            errors.parent_dim="parent_dim cannot be null"
        }
        if (img_src==null){
            errors.img_src="img_src cannot be null"
        }

        if ((Object.keys(errors)>1)){
            reject({ 
                errors:errors,
                valid:false
            })
        }

        return  Image.getSize(img_src, (img_width, img_height)=>{
            console.log('heree')
            if (reference_height){
                const height = img_height * (parent_dim / img_width)
                resolve ({
                    width:parent_dim,
                    height:height,
                    valid:true
                })
            }else {
                const width = img_width * (parent_dim / img_height)
                resolve ({
                    width:width,
                    height:parent_dim,
                    valid:true
                })
            }

        
        }, (error)=> {
            reject({ 
                errors:errors,
                valid:false
            })
        })

    })

}


//get relative time ago from a timestamp
export const get_relative_time_ago = (timestamp) => {
    return moment(new Date(parseInt(timestamp))).fromNow()
}
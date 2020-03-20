import { 
    Image
 } from "react-native";
import AsyncStorage from "@react-native-community/async-storage"

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


//setting up the user login screen/ register_screen
export const setting_up_the_user = async(user_data, apollo_client) => {
    //storing values in async storage
    try{
        //setting up the user_info
        const user_info = JSON.stringify(user_data)
        await AsyncStorage.setItem("user_info",user_info)

        //setting up jwttoken
        await AsyncStorage.setItem("token", user_data.jwt)
                   
    }catch(e){
        console.log("AsyncStorage Error: "+e)
    }

    //writing to Apollo's local state
    apollo_client.writeData({
        data:{
            user_info:{
                ...user_data,
                __typename:"User"
            }
        }
    })

    return

}
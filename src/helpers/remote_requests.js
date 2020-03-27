import {Buffer} from "buffer"
import axios from "axios"
import { GET_PRESIGNED_URL } from "./../apollo_client/apollo_queries/index";

export const upload_image_to_s3 = async(presigned_url, image_data, file_mime) => {
    const buffer = Buffer.from(image_data, "base64")
    const result = await axios.put(presigned_url, buffer, {
        headers:{
            "Content-type":file_mime,
            "Content-encoding":"base64"
        }
    })
    return result
}

export const get_presigned_url = async(apollo_client, file_name, file_mime) => {

    const {data} = await apollo_client.query({
        query:GET_PRESIGNED_URL,
        variables:{
             file_name:file_name,
             file_mime:file_mime
         }
    })
    
    return data.get_image_upload_url
}  
import {Buffer} from "buffer"
import axios from "axios"

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
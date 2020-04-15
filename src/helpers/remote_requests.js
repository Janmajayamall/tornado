import {Buffer} from "buffer"
import axios from "axios"
import { 
    GET_PRESIGNED_URL,
    GET_POST_COMMENTS,
    DELETE_COMMENT,
    DELETE_CAPTION,
    GET_POST_CAPTIONS,
    DEACTIVATE_ROOM_POST,
    GET_ROOM_FEED,
    GET_USER_PROFILE_POSTS
 } from "./../apollo_client/apollo_queries/index";
import { constants } from "./constants";


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


export const delete_comment_apollo = async(apollo_client, comment_object) => {

    try{
        const data = apollo_client.mutate({
            mutation:DELETE_COMMENT,
            variables:{
                comment_id:comment_object._id
            },
            optimisticResponse:()=>{
                return({
                    __typename:"Mutation",
                    delete_comment:comment_object._id
                })
            },
            update:(cache, {data})=>{

                //reaching caption objects for the post from cache
                const {get_post_comments} = cache.readQuery({
                    query:GET_POST_COMMENTS,
                    variables:{
                        content_id:comment_object.content_id,
                        content_type:comment_object.content_type
                    }
                })

                const update_comments_list = []
                get_post_comments.forEach(comment => {
                    if(comment._id!==data.delete_comment){
                        update_comments_list.push(comment)
                    }
                });

                //writing it to the cache
                cache.writeQuery({
                    query:GET_POST_COMMENTS,
                    variables:{
                        content_id:comment_object.content_id,
                        content_type:comment_object.content_type
                    },
                    data:{
                        get_post_comments:update_comments_list
                    }
                })

            }
        })
        return data
    }catch(e){
        return null
    }


}

export const delete_caption_apollo = async(apollo_client, caption_object) => {

    try{
        const data = apollo_client.mutate({
            mutation:DELETE_CAPTION,
            variables:{
                caption_id:caption_object._id
            },
            optimisticResponse:()=>{
                return({
                    __typename:"Mutation",
                    delete_caption:caption_object._id
                })
            },
            update:(cache, {data})=>{

                //reaching caption objects for the post from cache
                const {get_post_captions} = cache.readQuery({
                    query:GET_POST_CAPTIONS,
                    variables:{
                        post_id:caption_object.post_id
                    }
                })

                const update_captions_list = []
                get_post_captions.forEach(caption => {
                    if(caption._id!==data.delete_caption){
                        update_captions_list.push(caption)
                    }
                });

                //writing it to the cache
                cache.writeQuery({
                    query:GET_POST_CAPTIONS,
                    variables:{
                        post_id:caption_object.post_id
                    },
                    data:{
                        get_post_captions:update_captions_list
                    }
                })

            }
        })
        return data
    }catch(e){
        return null
    }

}


export const delete_post_apollo = async(apollo_client, post_object) => {    
    try{
        const data = await apollo_client.mutate({
            mutation:DEACTIVATE_ROOM_POST,
            variables:{
                post_id:post_object._id
            },
            refetchQueries:[
                {
                    query:GET_ROOM_FEED,
                    variables:{
                        limit:constants.apollo_query.pagination_limit
                    }
                },
                {
                    query:GET_USER_PROFILE_POSTS,
                    variables:{
                        limit:constants.apollo_query.pagination_limit
                    }
                }
            ]
        })
        return data
    }catch(e){
        
    }

}
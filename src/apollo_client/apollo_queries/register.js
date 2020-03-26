
import gql from 'graphql-tag'

// Mutation 
export const REGISTER_USER = gql`
    mutation register_users(
                                $email:String!, 
                                $password:String!, 
                                $age:Int!, 
                                $username:String!, 
                                $name:String!, 
                                $three_words:String!, 
                                $bio:String!,
                                $default_avatar:Boolean!,
                                $avatar:image_input
                            ){
        register_user(user_input:{
            email:$email,
            password:$password,
            age:$age,
            username:$username,
            name:$name, 
            three_words:$three_words,
            bio:$bio,
            default_avatar:$default_avatar,
            avatar:$avatar
        }){
            _id, 
            user_id,
            avatar{
                image_name,
                height,
                width, 
                cdn_url
            },
            jwt, 
            email, 
            age, 
            name, 
            three_words, 
            bio,
            username, 
            default_avatar,
            timestamp
        }
    }
`

//Query
export const GET_PRESIGNED_URL = gql`
    query get_presigned_url($file_name:String!, $file_mime:String!){
        get_image_upload_url(user_input:{
            file_name:$file_name
            file_mime:$file_mime
        })
    }
`

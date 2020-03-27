
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
                _id,
                image_name,
                height,
                width, 
                cdn_url
            },
            jwt, 
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

// Mutation 
export const EDIT_USER_PROFILE = gql`
    mutation register_users(
                                $username:String!,
                                $name:String!,
                                $bio:String!,
                                $three_words:String!,
                                $avatar:image_input,
                                $last_avatar_id:ID
                            ){
        edit_user_profile(user_input:{
            username:$username,
            name:$name,
            bio:$bio,
            three_words:$three_words,
            avatar:$avatar,
            last_avatar_id:$last_avatar_id
        }){
            _id, 
            user_id,
            avatar{
                _id,
                image_name,
                height,
                width, 
                cdn_url
            },
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

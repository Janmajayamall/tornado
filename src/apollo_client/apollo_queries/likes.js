import gql from "graphql-tag"

//Mutations
export const TOGGLE_LIKE = gql`

    mutation toggle_likes($status:String!, $content_id:ID!){
        toggle_like(user_input:{
            content_id:$content_id      
            status:$status
        }),{
            _id,
            content_id, 
            status
        }
    }
`


//Queries 
export const GET_LIKES_LIST = gql`

    query get_like_list($content_id:ID!){
        get_likes_list(content_id:$content_id){
            _id,
            user_id,
            username,
            default_avatar,
            avatar{
                _id,
                image_name,
                height,
                width, 
                cdn_url
            },
            is_user
        }
    }
`
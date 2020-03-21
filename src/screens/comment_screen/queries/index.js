import gql from "graphql-tag"

// Queries

export const GET_POST_COMMENTS = gql`
    query get_comments($content_id:ID!, $content_type:String! ){
        get_post_comments(user_input:{
            content_id:$content_id,
            content_type:$content_type
        }),{
            _id, 
            content_id, 
            content_type, 
            creator_info{
                username,
                timestamp,
                avatar
            }, 
            comment_body,
            timestamp,
            last_modified
        }
    }
`

export const GET_LOCAL_USER_INFO = gql`
    {
        user_info @client {
            user_id,
            avatar, 
            username,
            
        }
    }
`


//Mutations
export const CREATE_COMMENT = gql`

    mutation create_comments($user_id:ID!, $content_id:ID!, $content_type:String!, $comment_body:String!){
        
        create_comment(user_input:{
            user_id:$user_id,
            content_id:$content_id
            content_type:$content_type
            comment_body:$comment_body
        }),{
            _id, 
            content_id, 
            comment_body,
            content_type
        }
    }
`;

export const CREATE_LIKE = gql`

    mutation create_likes($user_id:ID!, $like_type:String!, $content_id:ID!){
        create_like(user_input:{
            user_id:$user_id, 
            like_type:$like_type,
            content_id:$content_id        
        }),{
            _id,
            user_id, 
            content_id, 
            like_type,
            status
        }
    }

`

export const UNLIKE_CONTENT = gql`

    mutation unlike_contents($user_id:ID!, $like_type:String!, $content_id:ID!){
        unlike_content(user_input:{
            user_id:$user_id, 
            like_type:$like_type,
            content_id:$content_id        
        }),{
            _id,
            user_id, 
            content_id, 
            like_type,
            status
        }
    }

`
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

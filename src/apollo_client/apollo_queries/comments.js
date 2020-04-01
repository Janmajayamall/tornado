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
                avatar{
                    width,
                    height,
                    image_name, 
                    cdn_url
                }
                default_avatar
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
            avatar{
                image_name,
                width, 
                height, 
                cdn_url
            }, 
            username,
            age, 
            name, 
            three_words, 
            bio, 
            default_avatar,
            timestamp
        }
    }
`

export const GET_POST_CAPTIONS = gql`
    query get_post_caption($post_id:ID!){
        get_post_captions(post_id:$post_id){
            _id,
            post_id,
            creator_info{
                user_id,
                avatar{
                    image_name,
                    width, 
                    height, 
                    cdn_url
                }, 
                username,
                three_words
            },
            timestamp,
            last_modified,        
            description,     
            up_votes_count, 
            down_votes_count,  
            user_vote_object{
                _id, 
                content_id, 
                vote_type
            }
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
            content_type,
        }
    }
`;


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

export const TOGGLE_VOTE = gql`

    mutation toggle_votes($content_id:ID!, $vote_type:String!, $content_type:String!){
        toggle_vote(user_input:{
            content_id:$content_id, 
            vote_type:$vote_type, 
            content_type:$content_type
        }){
            content_id,
            vote_type,
            content_type
        }
    }
`
import gql from "graphql-tag"

//Queries
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
                three_words,
                default_avatar
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
            },
            is_user
        }
    }
`

//Mutations
export const CREATE_CAPTION = gql`

    mutation create_captions($post_id:ID!, $description:String!){
        
        create_caption(user_input:{
            post_id:$post_id,
            description:$description
        }),{
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
                three_words,
                default_avatar
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
            },
            is_user
        }
    }
`;


export const DELETE_CAPTION = gql`

    mutation delete_captions($caption_id:ID!){

        delete_caption(caption_id:$caption_id)
        
    }
`


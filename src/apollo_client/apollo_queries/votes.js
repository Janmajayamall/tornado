import gql from "graphql-tag"

//Mutations

export const TOGGLE_VOTE = gql`

    mutation toggle_votes($content_id:ID!, $vote_type:String!, $content_type:String!){
        toggle_vote(user_input:{
            content_id:$content_id, 
            vote_type:$vote_type, 
            content_type:$content_type
        }){
            _id, 
            content_id,
            vote_type,
        }
    }
`
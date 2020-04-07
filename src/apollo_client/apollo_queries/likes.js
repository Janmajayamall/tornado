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

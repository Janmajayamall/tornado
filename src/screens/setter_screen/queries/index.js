import gql from "graphql-tag"

//Query
export const GET_LOCAL_USER_INFO = gql`
    {
        user_info @client {
            jwt, 
            _id,
            user_id
        }
    }
`
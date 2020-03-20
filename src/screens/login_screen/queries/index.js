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


//Mutations
export const LOGIN_USER = gql`
    mutation login_users($email:String!, $password:String!){
        login_user(user_input:{
            email:$email,
            password:$password
        }){
            _id,
            username,
            avatar,
            jwt,
            email,
            age,
            user_id
        }
    }
`
import gql from "graphql-tag"

//Query

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
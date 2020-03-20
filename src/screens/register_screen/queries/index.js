
import gql from 'graphql-tag'

// Mutation 
export const REGISTER_USER = gql`
    mutation register_users($email:String!, $password:String!, $age:Int!, $username:String!, $name:String!, $three_words:String!, $bio:String!){
        register_user(user_input:{
            email:$email,
            password:$password,
            age:$age,
            username:$username,
            name:$name, 
            three_words:$three_words,
            bio:$bio
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

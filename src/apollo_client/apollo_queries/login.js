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
            user_id,
            avatar{
                image_name,
                height,
                width, 
                cdn_url
            },
            jwt, 
            email, 
            age, 
            name, 
            three_words, 
            bio,
            username, 
            default_avatar
        }
    }
`
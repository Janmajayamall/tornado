import gql from "graphql-tag"

//Query
export const GET_USER_INFO = gql`
    query{
        get_user_info{
            _id,
            user_id,
            age, 
            username, 
            timestamp, 
            name, 
            three_words,
            bio,
            avatar{
                _id,
                image_name, 
                width, 
                height, 
                cdn_url
            },
            default_avatar,
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
            user_id,
            avatar{
                _id,
                image_name,
                height,
                width, 
                cdn_url
            },
            jwt, 
            age, 
            name, 
            three_words, 
            bio,
            username, 
            default_avatar,
            timestamp, 
        }
    }
`



import gql from 'graphql-tag'

// Mutation 
export const REGISTER_USER = gql`
    query register_users($email:String!, $password:String!, $dob:String!, $username:String!){
        register_user(user_input:{
            email:$email,
            password:$password,
            dob:$password,
            username:$username
        }){
            _id,
            username,
            avatar,
            jwt,
            email,
            dob
        }
    }
`

export const GET_ROOM_FEED = gql`
    query get_room_posts($limit:Int!, $room_post_cursor:String){
        get_room_posts_user_id(user_input:{limit:$limit, room_post_cursor:$room_post_cursor}){
            room_posts{
                _id, 
                creator_id,
                creator_info{
                    user_id, 
                    username,
                    dob,
                    avatar
                },
                likes_count,
                user_liked, 
                img_url, 
                description,
                timestamp
                },
            next_page,
            room_post_cursor, 
            last_room_post_cursor
        }
    }
` 
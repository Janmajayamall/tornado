import gql from "graphql-tag"

//Mutations
export const CREATE_ROOM_POST = gql`
    mutation create_room_posts(
        $creator_id:ID!,
        $description:String!, 
        $room_ids:[ID!]!,
        $post_type:String!,
        $image:image_input,
    ){
        create_room_post(user_input:{
            creator_id:$creator_id,
            description:$description,
            room_ids:$room_ids
            post_type:$post_type,
            image:$image
        }),{
            _id, 
            creator_id,
            creator_info{
                user_id, 
                username,
                avatar{
                    width,
                    height,
                    cdn_url,
                    image_name
                },
                three_words,
                default_avatar
            },
            likes_count,
            user_liked, 
            image{
                width,
                height,
                cdn_url,
                image_name
            }, 
            description,
            timestamp,
            post_type,
            room_objects{
                _id,
                name,
                timestamp
            }
        }
    }
`

// Query for feed of the screen (Paginated)
export const GET_USER_PROFILE_POSTS = gql`
    query get_user_profile_post($limit:Int!, $room_post_cursor:String, $user_id:ID){
        get_user_profile_posts(user_input:{limit:$limit, room_post_cursor:$room_post_cursor, user_id:$user_id}){
            room_posts{
                _id, 
                creator_id,
                creator_info{
                    user_id, 
                    username,
                    avatar{                    
                        width,
                        height,
                        cdn_url,
                        image_name
                    },
                    three_words,
                    default_avatar
                },
                likes_count,
                user_liked, 
                image{
                    width,
                    height,
                    cdn_url,
                    image_name
                }, 
                description,
                timestamp,
                post_type,
                room_objects{
                    _id,
                    name,
                    timestamp
                }
            },
            next_page,
            room_post_cursor, 
            last_room_post_cursor,
                   
        }
    }
` 
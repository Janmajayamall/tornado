import gql from "graphql-tag"

//Query
export const GET_NOT_JOINED_ROOMS = gql`
    {
        get_not_joined_rooms{
            _id,
            name,
            status,
            room_members_count,
            user_follows,
            timestamp,
            last_modified
        }
    }
`

export const GET_ROOM_POSTS = gql`
    query get_room_post($room_id:ID!, $limit:Int!, $room_post_cursor:String){
        get_room_posts_room_id(user_input:{
            room_id:$room_id,
            limit:$limit,
            room_post_cursor:$room_post_cursor
        }),{
            get_room_posts_user_id(user_input:{limit:$limit, room_post_cursor:$room_post_cursor}){
                room_posts{
                    _id, 
                    creator_id,
                    creator_info{
                        user_id, 
                        username,
                        avatar{
                            width,
                            height
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
                    timestamp
                },
                next_page,
                room_post_cursor, 
                last_room_post_cursor            
            }
        }
    }
`

// 
//Mutations
export const BULK_ROOM_FOLLOWS = gql`

    mutation bulk_follow_room($follow_room_objects:[follow_room_input!]!){
        bulk_follow_rooms(user_input:$follow_room_objects){
            _id, 
            room_id, 
            follower_id,
            status
        }
    }
`
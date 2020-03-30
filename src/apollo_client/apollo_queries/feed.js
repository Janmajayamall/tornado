import gql from 'graphql-tag'

// Query for feed of the screen (Paginated)
export const GET_ROOM_FEED = gql`
    query get_room_posts($limit:Int!, $room_post_cursor:String){
        get_room_posts_user_id(user_input:{limit:$limit, room_post_cursor:$room_post_cursor}){
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
                },
                caption_objects{
                    post_id,
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
                    timestamp,
                    likes_count, 
                    user_liked,
                    last_modified,
                    description
                }
            },
            next_page,
            room_post_cursor, 
            last_room_post_cursor            
        }
    }
` 
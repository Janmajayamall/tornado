import gql from "graphql-tag"

export const POST_OBJECT =  gql`
    query post_object{
            post_detailed_screen(_id:$_id){
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
        }
    `
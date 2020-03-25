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
            image{
                width, 
                height, 
                image_name, 
                cdn_url
            }, 
            description,
            room_ids,
            timestamp,
            last_modified,
            status,
            post_type
        },
    }
`
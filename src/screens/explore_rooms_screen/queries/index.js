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
export const GET_LOCAL_USER_INFO = gql`
    {
        user_info @client {
            user_id,
            avatar, 
            username,
            
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
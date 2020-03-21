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

// 
//Mutations

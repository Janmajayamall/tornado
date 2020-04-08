import gql from "graphql-tag"

//Query
export const GET_NOT_JOINED_ROOMS = gql`
    {
        get_not_joined_rooms{
            _id,
            name,
            status,
            timestamp,
            last_modified, 
            creator_info{                
                username,
            },            
            room_members_count,
            user_follows,
            description,
            is_user
        }
    }
`

export const GET_ALL_JOINED_ROOMS = gql`
    query get_all_joined_room($user_id:ID){
        get_all_joined_rooms(user_id:$user_id){
            _id,
            name,
            status,
            timestamp,
            last_modified,            
            creator_info{                
                username,
            }, 
            room_members_count,
            user_follows,
            description,
            is_user
        }
    }
`

export const GET_ALL_CREATED_ROOMS = gql`
    query get_all_created_room($user_id:ID){
        get_all_created_rooms(user_id:$user_id){
            _id,
            name,
            status,
            timestamp,
            last_modified,   
            creator_info{                
                username,
            },          
            room_members_count,
            user_follows,
            description,
            is_user
        }
    }
`

export const GET_COMMON_ROOMS = gql`
    query get_common_room($user_ids:[ID!]!){
        get_common_rooms(user_ids:$user_ids){
            _id,
            name,
            status,
            timestamp,
            last_modified,  
            creator_info{                
                username,
            },           
            room_members_count,
            user_follows,
            description,
            is_user
        }
    }
`

export const GET_ROOM_DEMOGRAPHICS = gql`
    query get_room_demographic($room_id:ID!){
        get_room_demographics(room_id:$room_id){
            _id,
            name,
            status,
            timestamp,
            last_modified,            
            creator_info{
                user_id, 
                username,
                avatar{
                    width, 
                    height, 
                    image_name,
                    cdn_url
                },
                timestamp,
                bio,
                three_words
            }, 
            room_members_count,
            user_follows,
            description,
            is_user
        }
    }
`

export const GET_ROOMS = gql`
    query get_room($name_filter:String!){
        get_rooms(user_input:{
            name_filter:$name_filter
        }){
            _id,
            name,
            status,
            timestamp,
            last_modified,            
            creator_info{                
                username,
            }, 
            room_members_count,
            user_follows,
            description,
            is_user
        }
    }
`

export const CHECK_ROOM_NAME = gql`
    query check_room_names($room_name:String!){
        check_room_name(room_name:$room_name)
    }
`


//Mutations
export const BULK_ROOM_FOLLOWS = gql`

    mutation bulk_follow_room($follow_room_objects:[bulk_follow_room_input!]!){
        bulk_follow_rooms(user_input:$follow_room_objects){
            _id, 
            room_id, 
            follower_id,
            status
        }
    }

`


export const CREATE_ROOM = gql`

    mutation create_rooms($name:String!, $creator_id:ID!, $description:String!){
        create_room(user_input:{
            name:$name, 
            creator_id:$creator_id,
            description:$description
        }){
            _id,
            name,
            status,
            timestamp,
            last_modified,
            creator_id,
            room_members_count,
            user_follows
        }
    }
`

export const TOGGLE_FOLLOW_ROOM = gql`
    mutation toggle_follow_rooms($room_id:ID!, $status:String!){
        toggle_follow_room(user_input:{
            room_id:$room_id, 
            status:$status
        }){
            room_id,
            status
        }
    }    
`





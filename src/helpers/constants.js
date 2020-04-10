export const constants = {
    navigation:{
        action_buttons:{
            ADD_POST:"add_post",
            VIEW_PROFILE:"view_profile",
            SHARE_POST:"share_post",
            ADD_ROOM:"add_room",
            CREATE_ROOM:"create_room",
            EDIT_PROFILE:"edit_profile",
            DONE_POST_ROOM_SELECTION:"done_post_room_selection",
            SEARCH_ROOMS:"search_rooms",
            FOLLOW_BULK:"follow_bulk",
            SETTINGS:"settings"
        }
    },
    queries:{
        get_all_joined_rooms:"GET_ALL_JOINED_ROOMS",
        get_all_created_rooms:"GET_ALL_CREATED_ROOMS",
        get_common_rooms:"GET_COMMON_ROOMS"
    },
    create_post_type:{
        room_post:"ROOM_POST",
        room_caption_post:"ROOM_CAPTION_POST"
    },
    status:{
        active:"ACTIVE",
        not_active:"NOT_ACTIVE"
    },
    avatar_text_panel_type:{
        user:"USER",
        comment_display:"COMMENT_DISPLAY",
        comment_input:"COMMENT_INPUT",
        caption:"CAPTION",
        caption_input:"CAPTION_INPUT"
    },
    comment_list_query_type:{
        caption_query:"CAPTION_QUERY",
        comment_query:"COMMENT_QUERY"
    },
    vote_type:{
        up:"UP",
        down:"DOWN"
    },
    post_types:{
        room_post:"ROOM_POST",
        room_caption_post:"ROOM_CAPTION_POST"
    },
    input_limits:{
        username:30,
        post_description:2000,
        caption:2000,
        bio:500,
        three_words:40,
        min_age:1,
        max_password:100,
        min_password:8,
        name:100,
        room_name:50,
        room_description:1000,
        comment:2000
    },
    apollo_query:{
        network_status:{
            refetch:4, 
            fetchMore:3, 
            ready:7,
            error:8,
            loading:1, 
            setVariables:2,
            poll:6
        }
    }
}
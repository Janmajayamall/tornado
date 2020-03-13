User{
    _id,
    username,
    hashed_password,
    timestamp,
    last_modified
}

User_Account{
    _id,
    user_id,
    bod,
    email,
    avatar,
    timestamp,
    last_modified
}

room{
    _id, 
    creator_id, 
    timestamp, 
    name -> unique,
    last_modified,
    status
}

room_follow:{
    _id, 
    room_id,
    follower_id, 
    timestamp, 
    status,
    last_modified
}

post{
    _id,
    creator_id,
    img_url,
    vid_url, 
    description,
    room_ids:[

    ],
    timestamp,
    last_modified,
    status
}

likes{
    _id, 
    user_id, 
    post_id,
    comment_id, 
    timestamp,
    status,
    last_modified,
    like_type
}

comments{
    _id, 
    user_id, 
    post_id, 
    timestamp,
    status,
    last_modified
}





import { 
    Image
 } from "react-native";
import moment from "moment"
import { NetworkStatus } from "apollo-client";


//get relative time ago from a timestamp
export const get_relative_time_ago = (timestamp) => {
    return moment(new Date(parseInt(timestamp))).fromNow()
}

//filter posts from blocked user ids
export const filter_blocked_posts = (posts, blocked_user_ids) => {

    if(!blocked_user_ids || !posts){
        return posts
    }

    let new_posts = []

    posts.forEach(post => {
        if(!blocked_user_ids.has(post.creator_id)){
            new_posts.push(post)
        }
    });

    return new_posts
   
}
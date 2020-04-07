import { 
    Image
 } from "react-native";
import moment from "moment"


//get relative time ago from a timestamp
export const get_relative_time_ago = (timestamp) => {
    return moment(new Date(parseInt(timestamp))).fromNow()
}
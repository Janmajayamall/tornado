import {Navigation} from 'react-native-navigation'
// import {Provider} from 'react-redux'

//import store
import {store} from './../store/configure_store'

//import all screens
import feed_screen from "./../screens/feed_screen/feed_screen"
import comment_screen from "./../screens/comment_screen/comment_screen"
import register_screen from "./../screens/register_screen/register_screen"
import register_other_att_screen from "./../screens/register_screen/register_other_att"
import login_screen from "./../screens/login_screen/login_screen"
import setter_screen from "./../screens/setter_screen/setter_screen"
import explore_rooms_screen from "./../screens/explore_rooms_screen/explore_rooms_screen"
import room_details_screen from "./../screens/explore_rooms_screen/room_details_screen"
import create_room_posts_screen from "../screens/create_room_posts/create_room_posts_screen"
import create_post_room_select_screen from "./../screens/create_room_posts/create_post_room_select_screen"
import add_rooms_screen from "./../screens/add_rooms_screen/add_rooms_screen"
import profile_screen from "./../screens/profile_screen/profile_screen"
import edit_profile_screen from "./../screens/edit_profile_screen/edit_profile_screen"

//importing apollo client 
import apollo_client from './../apollo_client/client_configuration'

//importing provider enhancer
import enhance_provider_hoc from './enhance_provider'

import {
    FEED_SCREEN,
    COMMENT_SCREEN,
    REGISTER_SCREEN,
    REGISTER_OTHER_ATT_SCREEN,
    LOGIN_SCREEN,
    SETTER_SCREEN,
    EXPLORE_ROOMS_SCREEN,
    ROOM_DETAILS_SCREEN,
    CREATE_ROOM_POSTS_SCREEN,
    CREATE_POST_ROOM_SELECT_SCREEN,
    ADD_ROOMS_SCREEN,
    PROFILE_SCREEN,
    EDIT_PROFILE_SCREEN
} from './screens'

export default function () {
    Navigation.registerComponent(COMMENT_SCREEN, ()=>enhance_provider_hoc(comment_screen, apollo_client, store)),
    Navigation.registerComponent(FEED_SCREEN, ()=>enhance_provider_hoc(feed_screen, apollo_client, store)),
    Navigation.registerComponent(REGISTER_SCREEN, ()=>enhance_provider_hoc(register_screen, apollo_client, store))
    Navigation.registerComponent(REGISTER_OTHER_ATT_SCREEN, ()=>enhance_provider_hoc(register_other_att_screen, apollo_client, store))
    Navigation.registerComponent(LOGIN_SCREEN, ()=>enhance_provider_hoc(login_screen, apollo_client, store))
    Navigation.registerComponent(SETTER_SCREEN, ()=>enhance_provider_hoc(setter_screen, apollo_client, store))
    Navigation.registerComponent(EXPLORE_ROOMS_SCREEN, ()=>enhance_provider_hoc(explore_rooms_screen, apollo_client, store))
    Navigation.registerComponent(ROOM_DETAILS_SCREEN, ()=>enhance_provider_hoc(room_details_screen, apollo_client, store))
    Navigation.registerComponent(CREATE_ROOM_POSTS_SCREEN, ()=>enhance_provider_hoc(create_room_posts_screen, apollo_client, store))
    Navigation.registerComponent(CREATE_POST_ROOM_SELECT_SCREEN, ()=>enhance_provider_hoc(create_post_room_select_screen, apollo_client, store))
    Navigation.registerComponent(ADD_ROOMS_SCREEN, ()=>enhance_provider_hoc(add_rooms_screen, apollo_client, store))
    Navigation.registerComponent(PROFILE_SCREEN, ()=>enhance_provider_hoc(profile_screen, apollo_client, store))
    Navigation.registerComponent(EDIT_PROFILE_SCREEN, ()=>enhance_provider_hoc(edit_profile_screen, apollo_client, store))

}
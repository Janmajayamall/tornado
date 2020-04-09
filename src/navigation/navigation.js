
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign'

import {
  FEED_SCREEN,
  REGISTER_SCREEN,
  LOGIN_SCREEN,
  SETTER_SCREEN,
  EXPLORE_ROOMS_SCREEN,
  ROOM_DETAILS_SCREEN,
  REGISTER_OTHER_ATT_SCREEN,
  CREATE_ROOM_POSTS_SCREEN,
  CREATE_ROOM_POST_SELECT_SCREEN,
  ADD_ROOMS_SCREEN
} from './screens';

import registerScreens from './register_screens';

// import navigation functions
import { navigation_set_root_one_screen } from "./navigation_routes/index";

//importing helpers
import {
  constants
} from './../helpers/index'


// Register all screens on launch
registerScreens();

export function start_app () {

  navigation_set_root_one_screen({screen_name:LOGIN_SCREEN})

//   Promise.all([
//     Icon.getImageSource("check", size=base_style.icons.icon_size)
// ]).then(icons=>{
//     navigation_set_root_one_screen({
//         screen_name:EXPLORE_ROOMS_SCREEN,
//         options:{
//             topBar: {
//                 rightButtons: [
//                     {
//                         id: constants.navigation.action_buttons.FOLLOW_BULK,
//                         icon:icons[0],
//                         iconColor:base_style.color.icon_selected                                                                        
//                     },                          
//                 ],
//                 rightButtonColor:base_style.color.icon_selected,
//                 background: {
//                 color: base_style.color.primary_color,
//                 }                           
//             },   
//         }
//     })
// })
}

 




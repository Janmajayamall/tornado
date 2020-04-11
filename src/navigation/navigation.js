
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign'
import {CachePersistor, persistCache} from "apollo-cache-persist"
import AsyncStorage from '@react-native-community/async-storage';
import {cache} from "./../apollo_client/client_configuration"

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

export async function start_app () {

  // const persistor = new CachePersistor({
  //   cache,
  //   storage: AsyncStorage,
  //   trigger: 'background',
  //   debug: true
  // });

  // await persistor.restore()

  navigation_set_root_one_screen({screen_name:SETTER_SCREEN})

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

 




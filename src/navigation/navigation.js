
import { Navigation } from 'react-native-navigation';

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


// Register all screens on launch
registerScreens();

export function start_app () {

  navigation_set_root_one_screen({screen_name:REGISTER_SCREEN})


}

 




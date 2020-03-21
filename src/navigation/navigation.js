
import { Navigation } from 'react-native-navigation';

import {
  FEED_SCREEN,
  REGISTER_SCREEN,
  LOGIN_SCREEN,
  SETTER_SCREEN,
  EXPLORE_ROOMS_SCREEN
} from './screens';

import registerScreens from './register_screens';


// Register all screens on launch
registerScreens();

export function start_app () {
 
  Navigation.setRoot({
    root: {
      stack: {
        children: [{
          component: {
            name: EXPLORE_ROOMS_SCREEN,
            options: {
              topBar: {
                visible: false,
              },
            }
          }
        }]
      }
    }
  });
}


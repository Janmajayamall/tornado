
import { Navigation } from 'react-native-navigation';

import {
  FEED_SCREEN,
  REGISTER_SCREEN,
  LOGIN_SCREEN,
  SETTER_SCREEN
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
            name: SETTER_SCREEN,
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


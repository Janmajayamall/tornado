
import { Navigation } from 'react-native-navigation';

import {
  FEED_SCREEN,
  REGISTER_SCREEN,
  LOGIN_SCREEN,
  SETTER_SCREEN,
  EXPLORE_ROOMS_SCREEN,
  ROOM_DETAILS_SCREEN,
  REGISTER_OTHER_ATT_SCREEN
} from './screens';

import registerScreens from './register_screens';


// Register all screens on launch
registerScreens();

export function start_app () {

  Navigation.setRoot({
    root: {
      bottomTabs: {
        id: 'BottomTabsId',
        children: [
          {
            stack: {
              children: [{
                component: {
                  name: REGISTER_OTHER_ATT_SCREEN,
                  options: {
                    topBar: {
                      visible: false,
                    },
                    bottomTab: {
                      text: 'FEED SCREEN',
                      fontSize: 20,
                      drawBehind:true
                    }
                  }
                }
              }]
            }
          },
          {
            component: {
              name: EXPLORE_ROOMS_SCREEN,
              options: {
                bottomTab: {
                  text: 'EXPLORE SCREEN',
                  fontSize: 20,
                }
              }
            },
          },
        ],
      },

    }
  });
}

 
  // Navigation.setRoot({
  //   root: {
      // stack: {
      //   children: [{
      //     component: {
      //       name: EXPLORE_ROOMS_SCREEN,
      //       options: {
      //         topBar: {
      //           visible: false,
      //         },
      //       }
      //     }
      //   }]
      // }
    // }
  // });



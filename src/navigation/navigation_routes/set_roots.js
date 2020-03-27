import { Navigation } from "react-native-navigation"
import {
  constants
} from "./../../helpers/index"

export const navigation_set_root_two_bottoms_tabs = (screen_one_object, screen_two_object, screen_three_object)=>{
    console.log(screen_three_object)
    Navigation.setRoot({
        root: {
          bottomTabs: {
            id: 'BottomTabsId',
            children: [
              {
                stack: {
                  children: [{
                    component: {
                      name: screen_one_object.screen_name,
                      passProps:screen_one_object.props,
                      options: {
                        bottomTab: {
                          text: screen_one_object.display_text,
                          fontSize: 20,
                          drawBehind:true
                        },
                        topBar: {
                          rightButtons: [
                            {
                              id: constants.navigation.action_buttons.VIEW_PROFILE,
                              text:"Me"
                            },
                            {
                              id: constants.navigation.action_buttons.ADD_POST,
                              text:"Add post"
                            }
                          ]
                        }
                      }
                    }
                  }]
                }
              },
              {
                stack: {
                  children: [{
                    component: {
                      name: screen_two_object.screen_name,
                      passProps:screen_two_object.props,
                      options: {
                        bottomTab: {
                          text: screen_two_object.display_text,
                          fontSize: 20,
                          drawBehind:true
                        }
                      }
                    }
                  }]
                }
              },
              {
                stack: {
                  children: [{
                    component: {
                      name: screen_three_object.screen_name,
                      passProps:screen_three_object.props,
                      options: {
                        bottomTab: {
                          text: screen_three_object.display_text,
                          fontSize: 20,
                          drawBehind:true
                        },
                        topBar: {
                          // rightButtons: [
                          //   {
                          //     id: constants.navigation.action_buttons.ADD_ROOM,
                          //     text:"Add New Room"
                          //   },
                          //   {
                          //     id: constants.navigation.action_buttons.EDIT_PROFILE,
                          //     text:"Edit Profile"
                          //   }
                          // ]
                        }
                      }
                    }
                  }]
                }
              },
            ],
          },
    
        }
      });

}

export const navigation_set_root_one_screen = (screen_object) => {
    console.log(screen_object)
    Navigation.setRoot({
        root: {
          stack: {
            children: [{
              component: {
                name: screen_object.screen_name,
                options: screen_object.options
              }
            }]
          }
        }
      });
}

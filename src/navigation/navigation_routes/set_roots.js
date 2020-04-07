import { Navigation } from "react-native-navigation"
import {
  constants
} from "./../../helpers/index"
import base_style from "./../../styles/base"
import Icon from 'react-native-vector-icons/AntDesign'
// importing screens
import {  
  FEED_SCREEN, 
  SEARCH_ROOMS_SCREEN, 
  PROFILE_SCREEN
} from "./../../navigation/screens";

export const navigation_set_root_two_bottoms_tabs = async ()=>{
    Promise.all([
      //bottom tab icons
      Icon.getImageSource("home",size=40),
      Icon.getImageSource("search1",size=40),
      Icon.getImageSource("smileo",size=40),
      
      //other icons
      Icon.getImageSource("plus", size=base_style.icons.icon_size)
    ]).then(icons=>{
      Navigation.setRoot({
        root: {
          bottomTabs: {
            id: 'BottomTabsId',
            children: [
              {
                // feed screen
                stack: {
                  children: [{
                    component: {
                      name: FEED_SCREEN,
                      passProps:{},
                      options: {
                        bottomTab: {
                          drawBehind:true,
                          icon: icons[0],  
                          iconInsets: { top: 20, left: 0, bottom: -20, right: 0 },
                          iconColor:base_style.color.icon_not_selected,
                          selectedIconColor:base_style.color.icon_selected                          
                        },
                        topBar: {
                          rightButtons: [
                            {
                              id: constants.navigation.action_buttons.ADD_POST,
                              icon:icons[3],
                              iconColor:base_style.color.icon_selected                                                                        
                            },                          
                          ],
                          rightButtonColor:base_style.color.icon_selected,
                          background: {
                            color: base_style.color.primary_color,
                          }                           
                        },                      
                      }
                    }
                  }]
                }
              },
              {
                // search screen
                stack: {
                  children: [{
                    component: {
                      name: SEARCH_ROOMS_SCREEN,
                      passProps:{},
                      options: {
                        bottomTab: {
                          drawBehind:true,
                          icon: icons[1],  
                          iconInsets: { top: 20, left: 0, bottom: -20, right: 0 },
                          iconColor:base_style.color.icon_not_selected,
                          selectedIconColor:base_style.color.icon_selected                          
                        },
                        topBar: {
                          visible:false                          
                        }
                      }
                    }
                  }]
                }
              },
              {
                // profile screen
                stack: {
                  children: [{
                    component: {
                      name:PROFILE_SCREEN,
                      passProps:{
                        is_user:true
                      },
                      options: {
                        bottomTab: {
                          drawBehind:true,
                          icon: icons[2],  
                          iconInsets: { top: 20, left: 0, bottom: -20, right: 0 },
                          iconColor:base_style.color.icon_not_selected,
                          selectedIconColor:base_style.color.icon_selected                          
                        },
                        topBar: {
                          visible:false,
                          background: {
                            color: base_style.color.primary_color,
                          }  
                        }
                      }
                    }
                  }]
                }
              },
            ],
            options:{
              bottomTabs:{
                backgroundColor: base_style.color.primary_color,
                titleDisplayMode:"alwaysHide"
              },
            }
          },
        }
      });
    })

}

export const navigation_set_root_one_screen = (screen_object) => {
    console.log(screen_object)
    Navigation.setRoot({
        root: {
          stack: {
            children: [{
              component: {
                name: screen_object.screen_name,
              options: screen_object.options,
                props:screen_object.props
              }
            }]
          }
        }
      });
}

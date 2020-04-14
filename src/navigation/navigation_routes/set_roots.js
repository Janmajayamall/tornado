import { Navigation } from "react-native-navigation"
import {
  constants
} from "./../../helpers/index"
import base_style from "./../../styles/base"
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons'
// importing screens
import {  
  FEED_SCREEN, 
  SEARCH_ROOMS_SCREEN, 
  PROFILE_SCREEN
} from "./../../navigation/screens";
import Icon from "react-native-vector-icons/AntDesign"

export const navigation_set_bottom_tabs = async ()=>{
    Promise.all([
      //bottom tab icons

      //home tab
      IconMaterialCommunity.getImageSource("home",size=base_style.icons.icon_bottom_tab_size, base_style.color.icon_selected),
      IconMaterialCommunity.getImageSource("home-outline",size=base_style.icons.icon_bottom_tab_size, color=base_style.color.icon_not_selected),

      //search tab
      IconAntDesign.getImageSource("search1",size=base_style.icons.icon_bottom_tab_size),

      //user tab
      IconMaterialCommunity.getImageSource("account",size=base_style.icons.icon_bottom_tab_size, base_style.color.icon_selected),
      IconMaterialCommunity.getImageSource("account-outline",size=base_style.icons.icon_bottom_tab_size, base_style.color.icon_not_selected),
      
      //other icons
      IconAntDesign.getImageSource("plus", size=base_style.icons.icon_size),
      IconAntDesign.getImageSource("setting", size=base_style.icons.icon_size)
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
                          icon: icons[1],  
                          selectedIcon: icons[0],
                          iconInsets: { top: 20, left: 0, bottom: -20, right: 0 },    
                          id:"dadw"                                          
                        },
                        topBar: {
                          rightButtons: [
                            {
                              id: constants.navigation.action_buttons.ADD_POST,
                              icon:icons[5],
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
                          icon: icons[2],  
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
                          icon: icons[4],
                          selectedIcon: icons[3]  ,
                          iconInsets: { top: 20, left: 0, bottom: -20, right: 0 },
                        },
                        topBar: {
                          rightButtons: [
                            {
                              id: constants.navigation.action_buttons.SETTINGS,
                              icon:icons[6],
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
    Navigation.setRoot({
        root: {
          stack: {
            children: [{
              component: {
                name: screen_object.screen_name,
              options: {                
                topBar: {
                  visible:false                
                },
                animations: {
                  setRoot: {
                    alpha: {
                      from: 0,
                      to: 1,
                      duration: 500
                    }
                  }
                },
                ...screen_object.options,
              },
              props:screen_object.props,              
              }
            }]
          }
        }
      });
}

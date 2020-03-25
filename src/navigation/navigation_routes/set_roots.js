import { Navigation } from "react-native-navigation"

export const navigation_set_root_two_bottoms_tabs = (screen_one_object, screen_two_object)=>{

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
                      options: {
                        topBar: {
                          visible: false,
                        },
                        bottomTab: {
                          text: screen_one_object.display_text,
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
                  name: screen_two_object.screen_name,
                  options: {
                    bottomTab: {
                      text: screen_two_object.display_text,
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

export const navigation_set_root_one_screen = (screen_object) => {
    Navigation.setRoot({
        root: {
          stack: {
            children: [{
              component: {
                name: screen_object.screen_name,
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

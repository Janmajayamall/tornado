import { Navigation } from "react-native-navigation"

export const navigation_push_to_screen = (componentId, screen_object, props={}) => {
    Navigation.push(componentId, {
        component: {
            name: screen_object.screen_name,
            passProps: props,
            options: {
                bottomTabs:{
                    visible:false
                }
            },
            topBar:{
                leftButtons: [
                    {
                        id: 'back',
                        icon: {
                            uri: 'back',
                        },
                    },
                ],
            }
        }
    });
}
import { Navigation } from "react-native-navigation"

export const navigation_push_to_screen = (componentId, screen_object) => {
    Navigation.push(componentId, {
        component: {
            name: screen_object.screen_name,
            passProps: screen_object.props,
            options: screen_object.options,
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
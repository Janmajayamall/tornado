import { Navigation } from "react-native-navigation"
import Icon from 'react-native-vector-icons/AntDesign'
import base_style from "./../../styles/base"
import { constants } from "../../helpers"

export const navigation_push_to_screen = (componentId, screen_object) => {
    Promise.all([
        Icon.getImageSource("left", size=base_style.icons.icon_size)
    ]).then(icons=>{

        //populating topBar with back button
        if(!screen_object.options){ //if options object is undefined, then define it
            screen_object.options={}
        }
        if(!screen_object.options.topBar){ //if topBar object is undefined, then define it
            screen_object.options.topBar={}
        }
        screen_object.options.topBar.backButton={
            icon: icons[0],
            visible: true,
            color:base_style.color.icon_selected ,
            id:constants.navigation.action_buttons.BACK      
        },
        screen_object.options.topBar.rightButtonColor=base_style.color.icon_selected //setting all button colors to icon_selected color
    
        //setting the background color of topBar
        screen_object.options.topBar.background={
            color:base_style.color.primary_color
        }

        // pushing to the screens
        Navigation.push(componentId, {
            component: {
                name: screen_object.screen_name,
                passProps: screen_object.props,
                options: screen_object.options,                 
            }
        });
    })
    
}
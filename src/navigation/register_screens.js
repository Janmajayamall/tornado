import {Navigation} from 'react-native-navigation'
// import {Provider} from 'react-redux'

//import store
import {store} from './../store/configure_store'

//import all screens
import feed_screen from "./../screens/feed_screen/feed_screen"
import comment_screen from "./../screens/comment_screen/comment_screen"
import register_screen from "./../screens/register_screen/register_screen"
import register_other_att_screen from "./../screens/register_screen/register_other_att"
import login_screen from "./../screens/login_screen/login_screen"
import setter_screen from "./../screens/setter_screen/setter_screen"

//importing apollo client 
import apollo_client from './../apollo_client/client_configuration'

//importing provider enhancer
import enhance_provider_hoc from './enhance_provider'

import {
    FEED_SCREEN,
    COMMENT_SCREEN,
    REGISTER_SCREEN,
    REGISTER_OTHER_ATT_SCREEN,
    LOGIN_SCREEN,
    SETTER_SCREEN
} from './screens'

export default function () {
    Navigation.registerComponent(COMMENT_SCREEN, ()=>enhance_provider_hoc(comment_screen, apollo_client, store)),
    Navigation.registerComponent(FEED_SCREEN, ()=>enhance_provider_hoc(feed_screen, apollo_client, store)),
    Navigation.registerComponent(REGISTER_SCREEN, ()=>enhance_provider_hoc(register_screen, apollo_client, store))
    Navigation.registerComponent(REGISTER_OTHER_ATT_SCREEN, ()=>enhance_provider_hoc(register_other_att_screen, apollo_client, store))
    Navigation.registerComponent(LOGIN_SCREEN, ()=>enhance_provider_hoc(login_screen, apollo_client, store))
    Navigation.registerComponent(SETTER_SCREEN, ()=>enhance_provider_hoc(setter_screen, apollo_client, store))
}
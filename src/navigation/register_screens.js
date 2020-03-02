import {Navigation} from 'react-native-navigation'
import {Provider} from 'react-redux'

//import store
import {store} from './../store/configure_store'

//import all screens
import feed_screen from './../screens/feed_screen/feed_screen'

import {
    FEED_SCREEN
} from './screens'

export default function () {
    Navigation.registerComponentWithRedux(FEED_SCREEN, ()=>feed_screen, Provider, store)
}
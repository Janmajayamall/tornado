import {Navigation} from 'react-native-navigation'
import {start_app} from './src/navigation/navigation'

Navigation.events().registerAppLaunchedListener(()=>start_app())


// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);

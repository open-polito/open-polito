import Analytics from 'appcenter-analytics';
import Config from 'react-native-config';
import App from './src/App';
import {name as appName} from './app.json';
import CodePush from 'react-native-code-push';
import {Platform, AppRegistry} from 'react-native';

const VARIANT = Config.VARIANT;
const ENABLE_CODEPUSH = Platform.OS === 'android' && VARIANT !== 'debug'; // disable CodePush in debug mode

if (ENABLE_CODEPUSH) {
  Analytics.setEnabled(true);
}

AppRegistry.registerComponent(appName, () =>
  ENABLE_CODEPUSH ? CodePush(App) : App,
);

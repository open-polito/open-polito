/**
 * @format
 */
import Analytics from 'appcenter-analytics';
import {AppRegistry, Platform} from 'react-native';
import Config from 'react-native-config';
import App from './App';
import {name as appName} from './app.json';
import CodePush from 'react-native-code-push';

const VARIANT = Config.VARIANT;
const ENABLE_CODEPUSH = VARIANT != 'debug'; // disable CodePush in debug mode

if (ENABLE_CODEPUSH) Analytics.setEnabled(true);

AppRegistry.registerComponent(appName, () =>
  ENABLE_CODEPUSH ? CodePush(App) : App,
);

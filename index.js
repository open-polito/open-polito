/**
 * @format
 */
import Analytics from 'appcenter-analytics';
import {AppRegistry, Platform} from 'react-native';
import Config from 'react-native-config';
import App from './App';
import {name as appName} from './app.json';
import CodePush from 'react-native-code-push';
import messaging from '@react-native-firebase/messaging';

const VARIANT = Config.VARIANT;
const ENABLE_CODEPUSH = VARIANT != 'debug'; // disable CodePush in debug mode

if (ENABLE_CODEPUSH) Analytics.setEnabled(true);

/**
 * Set FCM handler for background push notifications.
 * TODO iOS support
 */

if (Platform.OS == 'android' && VARIANT != 'debug') {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    Analytics.trackEvent('push_background');
  });
}

AppRegistry.registerComponent(appName, () =>
  ENABLE_CODEPUSH ? CodePush(App) : App,
);

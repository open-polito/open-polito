/**
 * @format
 */
import Analytics from 'appcenter-analytics';
import {AppRegistry, Platform} from 'react-native';
import Config from 'react-native-config';
import App from './App';
import {name as appName} from './app.json';
import CodePush from 'react-native-code-push';
import messaging, {firebase} from '@react-native-firebase/messaging';
import {backgroundMessageHandler} from './src/utils/push-notifications';
import Crashes, {ErrorAttachmentLog, ExceptionModel} from 'appcenter-crashes';

const VARIANT = Config.VARIANT;
const ENABLE_CODEPUSH = VARIANT != 'debug'; // disable CodePush in debug mode

if (ENABLE_CODEPUSH) Analytics.setEnabled(true);

/**
 * Set FCM handler for background push notifications.
 * TODO iOS support
 */
if (Platform.OS == 'android' && VARIANT != 'debug') {
  // Temporary tracking to understand why push notifications don't work
  // TODO Delete!
  const attachment = ErrorAttachmentLog.attachmentWithText(
    JSON.stringify({firebase: firebase.app('[DEFAULT]')}),
  );
  const em = ExceptionModel.createFromTypeAndMessage(
    'background_listener',
    'Initialized!',
  );
  Crashes.trackError(em, undefined, [attachment]);

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    await Analytics.trackEvent('push_background_received');
    await backgroundMessageHandler(remoteMessage);
  });
}

AppRegistry.registerComponent(appName, () =>
  ENABLE_CODEPUSH ? CodePush(App) : App,
);

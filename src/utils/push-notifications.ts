import {
  parsePushNotification,
  PushNotification,
} from 'open-polito-api/notifications';
import notifee, {
  AndroidCategory,
  AndroidImportance,
} from '@notifee/react-native';
import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import Crashes, {ExceptionModel} from 'appcenter-crashes';
import Analytics from 'appcenter-analytics';
import i18next from 'i18next';
import store from '../store/store';
import {setNotificationsStatus} from '../store/userSlice';
import {initialStatus} from '../store/status';

const triggerNotification = async (msg: PushNotification): Promise<void> => {
  // Fallback if error during msg parse
  const defaultNotificationChannel = {
    id: 'general',
    name: 'General',
  };
  const defaultMessage = {
    title: i18next.t('defaultMsgTitle'),
    body: i18next.t('defaultMsgBody'),
  };

  // Initialize as default
  let channel = {...defaultNotificationChannel};
  let _msg = {...defaultMessage};

  try {
    channel = {
      id: msg.topic,
      name: msg.topic.charAt(0).toUpperCase() + msg.topic.slice(1),
    };
    _msg = {
      title: `<b>${channel.name}</b>: ${msg.title}`,
      body: msg.text,
    };
  } catch (e) {
    // If error, set channel and _msg to default
    channel = {...defaultNotificationChannel};
    _msg = {...defaultMessage};
    throw e; // Throw for processing by AppCenter
  } finally {
    const channelId = await notifee.createChannel({
      id: channel.id,
      name: channel.name,
    });
    await notifee.displayNotification({
      ..._msg,
      android: {
        channelId: channelId,
        category: AndroidCategory.EVENT,
        importance: AndroidImportance.DEFAULT,
      },
    });
  }
};

const commonMessageHandler = async (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  background: boolean,
): Promise<void> => {
  let msg: PushNotification;
  let flags = {test: 'NOT_PARSED'};
  try {
    msg = parsePushNotification(remoteMessage.data);
    flags.test = msg.topic == 'test' ? 'true' : 'false';
    await triggerNotification(msg);
  } catch (e) {
    const exceptionModel = ExceptionModel.createFromError(e as Error);
    Crashes.trackError(exceptionModel);
  } finally {
    store.dispatch(setNotificationsStatus(initialStatus)); // Invalidate all notifications to reload them
    await Analytics.trackEvent(
      background ? 'push_background' : 'push_foreground',
      flags,
    );
  }
};

export const backgroundMessageHandler = async (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
): Promise<void> => {
  await commonMessageHandler(remoteMessage, true);
};

export const foregroundMessageHandler = async (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
): Promise<void> => {
  await commonMessageHandler(remoteMessage, false);
};

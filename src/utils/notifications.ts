import notifee, {
  AuthorizationStatus,
  InitialNotification,
} from '@notifee/react-native';

export interface NotificationData {
  title?: string;
  message?: string;
  channelId?: string;
  channelName?: string;
  channelDescription?: string;
  /**
   * Notification id
   */
  polito_id_notifica?: string;
  /**
   * Raw notification channel name
   */
  polito_transazione?: string;
}

export enum NotificationPrefix {
  POLITO = 'polito-',
}

/**
 * Encodes the notification id into the action id
 * @param data
 * @returns
 */
export const buildNotificationActionId = (data: NotificationData): string => {
  return `${NotificationPrefix.POLITO}${data.polito_id_notifica}`;
};

/**
 * Gives the original notification id from the action id
 * @param actionId
 * @returns
 */
export const decodeNotificationActionId = (actionId: string): string => {
  return actionId.replace(NotificationPrefix.POLITO, '');
};

/**
 * Returns which action to take based on the notification
 * TODO implement
 * @param n
 */
const getActionForNotification = (n: InitialNotification) => {
  const notificationId = decodeNotificationActionId(n.pressAction.id);
};

/**
 * Handle the notification press action
 * TODO implement
 */
const handleInitialNotification = async () => {
  const initialNotification = await notifee.getInitialNotification();

  if (!initialNotification) {
    return;
  }

  const action = getActionForNotification(initialNotification);
};

export const setupNotifications = async () => {
  const notificationSettings = await notifee.requestPermission();

  if (notificationSettings.authorizationStatus <= AuthorizationStatus.DENIED) {
    // TODO: handle denied permission
  }

  await handleInitialNotification();
};

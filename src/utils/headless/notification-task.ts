import notifee, {AndroidCategory} from '@notifee/react-native';
import {buildNotificationActionId, NotificationData} from '../notifications';

module.exports = async (data: NotificationData) => {
  const channelId = await notifee.createChannel({
    id: data.channelId || 'general',
    name: data.channelName || 'General',
  });

  await notifee.displayNotification({
    title: data.title || '',
    body: data.message || '',
    android: {
      channelId,
      smallIcon: 'ic_tablericons_school',
      category: AndroidCategory.SOCIAL,
      pressAction: {
        id: buildNotificationActionId(data),

        // Need this to be able to open the app
        // see https://github.com/invertase/notifee/issues/291#issuecomment-1012151997
        launchActivity: 'default',
      },
    },
  });

  return Promise.resolve();
};

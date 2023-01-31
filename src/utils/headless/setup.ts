import {AppRegistry} from 'react-native';

export enum HeadlessTask {
  NotificationTask = 'NotificationTask',
}

/**
 * Register all headless tasks here.
 */
export const setupHeadlessTasks = () => {
  AppRegistry.registerHeadlessTask(HeadlessTask.NotificationTask, () =>
    require('./notification-task'),
  );
};

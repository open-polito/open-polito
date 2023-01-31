import {NativeModules} from 'react-native';
const {UpdaterModule: _UpdaterModule, NotificationModule: _NotificationModule} =
  NativeModules;

/**
 * This native module handles installation of updates.
 *
 * Warning: Android only
 */
export namespace UpdaterModule {
  /**
   * Installs the APK
   */
  export const installUpdate: () => void = _UpdaterModule.installUpdate;
}

/**
 * Handles notifications from the native side.
 */
export namespace NotificationModule {
  /**
   * Gets the FCM token.
   *
   * Warning: Android only
   */
  export const getToken: () => Promise<string> = _NotificationModule.getToken;
}

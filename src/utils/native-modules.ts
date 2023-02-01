import {NativeModules} from 'react-native';
import {genericPlatform} from './platform';
const {UpdaterModule: _UpdaterModule, NotificationModule: _NotificationModule} =
  NativeModules;

/**
 * Gets the native function from the module.
 * @param module
 * @param name
 * @returns
 *
 * @throws Error if the platform does not support native modules
 */
const getNativeFunction = <T>(module: any, name: string): (() => T) => {
  if (genericPlatform !== 'mobile') {
    return () => {
      throw new Error(
        `Native function ${name} is not available on ${genericPlatform}`,
      );
    };
  }

  return module[name] || ((() => {}) as () => T);
};

/**
 * This native module handles installation of updates.
 *
 * Warning: Android only
 */
export namespace UpdaterModule {
  /**
   * Installs the APK
   */
  export const installUpdate = getNativeFunction<void>(
    _UpdaterModule,
    'installUpdate',
  );
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
  export const getToken = getNativeFunction<Promise<string>>(
    _NotificationModule,
    'getToken',
  );
}

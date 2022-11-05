import moment from 'moment';
import {Entry} from 'open-polito-api/lib/device';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
import store from '../store/store';
import version from '../../version.json';
import {appendFile, getDocumentsPath} from './fs';

export type BasicDeviceInfoLogEntry = {
  type: 'DEVICE_INFO';
  appBuildNumber: string;
  appBuildVariant: string;
  appVersion: string;
  appVersionBinary: string;
  osApiLevel: number;
  osName: string;
  osVersion: string;
  theme: 'light' | 'dark' | 'system';
};

export type RequestLogEntry = Entry & {
  type: 'REQUEST';
};

export type ErrorLogEntry = Error & {
  type: 'ERROR';
};

export type LogEntry =
  | BasicDeviceInfoLogEntry
  | RequestLogEntry
  | ErrorLogEntry;

export default class Logger {
  public static logsDirectoryPath = getDocumentsPath();

  public static logFilePath =
    Logger.logsDirectoryPath +
    '/' +
    'request_log-' +
    moment().format('YYYY-MM-DD-THHmmssSSS') +
    '.txt';

  public static hasLoggedBasicDeviceInfo: boolean = false;

  /**
   * Writes log entry to log file
   * @param entry
   *
   * @remarks
   * Uses ExternalDirectoryPath (/storage/emulated/0/Android/data/org.openpolito.app/files/) on Android,
   * DocumentDirectoryPath on iOS
   */
  static async writeToFile(entry: LogEntry) {
    await appendFile(Logger.logFilePath, JSON.stringify(entry) + '\n').catch(
      err => console.log(err),
    );
  }

  /**
   * Logs basic device info
   */
  static async logBasicDeviceInfo() {
    if (Logger.hasLoggedBasicDeviceInfo) return;
    const entry: BasicDeviceInfoLogEntry = {
      type: 'DEVICE_INFO',
      appBuildNumber: DeviceInfo.getBuildNumber(),
      appBuildVariant: Config.VARIANT || '',
      appVersion: version.version,
      appVersionBinary: DeviceInfo.getVersion(),
      osApiLevel: DeviceInfo.getApiLevelSync(),
      osName: DeviceInfo.getSystemName() || DeviceInfo.getBaseOsSync(),
      osVersion: DeviceInfo.getSystemVersion(),
      theme: store.getState().session.config.theme,
    };
    await Logger.writeToFile(entry);
    Logger.hasLoggedBasicDeviceInfo = true;
  }

  /**
   * Logs a network request
   *
   * @remarks See {@link Entry}
   * @param entry
   */
  static async logRequest(entry: Entry) {
    await Logger.logBasicDeviceInfo();
    // Don't log if debug options not enabled
    if (!parseInt(Config.ENABLE_DEBUG_OPTIONS!, 10)) return;
    // Don't log if login endpoint
    if (entry.endpoint.includes('login')) return;
    await Logger.writeToFile({
      type: 'REQUEST',
      ...entry,
    });
  }

  /**
   * Like {@link logRequest}, but called synchronously
   * @param entry
   */
  static logRequestSync(entry: Entry) {
    (async () => {
      await Logger.logBasicDeviceInfo();
      await Logger.logRequest(entry);
    })();
  }

  /**
   * Logs an error's name, message, and stack trace
   * @param error
   */
  static async logError(error: Error) {
    await Logger.logBasicDeviceInfo();
    await Logger.writeToFile({
      type: 'ERROR',
      ...error,
    });
  }
}

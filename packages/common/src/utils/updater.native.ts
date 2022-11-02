import {ExternalDirectoryPath, hash, unlink} from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import version from '../../../../version.json';

/**
 * Checks file integrity with SHA256
 * @param filePath
 * @param sha256
 * @returns
 */
export const checkFileMatchesSHA256 = async (
  filePath: string,
  sha256: string,
): Promise<boolean> => {
  const computedSHA256 = await hash(filePath, 'sha256');
  return sha256.toLowerCase() === computedSHA256.toLowerCase();
};

export const getUpdateDestinationFilePath = () => {
  return ExternalDirectoryPath + '/update.apk';
};

/**
 * Delete older APK and clear AsyncStorage entry
 * if update has been done (compare version codes)
 */
export const updateCleanup = async () => {
  try {
    const previousUpdateVersionCode = await AsyncStorage.getItem(
      '@versionCode',
    );
    if (
      previousUpdateVersionCode &&
      version.versionCode >= parseInt(previousUpdateVersionCode)
    ) {
      unlink(getUpdateDestinationFilePath())
        .catch()
        .then(() => {
          AsyncStorage.removeItem('@versionCode');
        });
    }
  } catch (e) {}
};

export * from './updater.common';

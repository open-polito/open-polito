import RNFS from 'react-native-fs';
import Keychain from 'react-native-keychain';

export const getDocumentsPath = () => {
  return RNFS.ExternalDirectoryPath || RNFS.DocumentDirectoryPath;
};

export const appendFile = async (path: string, content: string) => {
  try {
    await RNFS.appendFile(path, content);
  } catch (e) {
    console.log(e);
  }
};

export const getCredentials = async () => {
  return await Keychain.getGenericPassword();
};

export const saveCredentials = async (user: string, passwd: string) => {
  await Keychain.setGenericPassword(user, passwd);
};

export const clearCredentials = async () => {
  return await Keychain.resetGenericPassword();
};

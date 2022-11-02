import AsyncStorage from '@react-native-async-storage/async-storage';

const credentialsKey = '@credentials';

export const getDocumentsPath = () => {
  return null;
};

export const appendFile = async (path: string, content: string) => {
  console.warn('FILESYSTEM MODULE FOR WEB NOT IMPLEMENTED');
};

export const getCredentials = async () => {
  return JSON.parse((await AsyncStorage.getItem(credentialsKey)) || '{}');
};

export const saveCredentials = async (username: string, password: string) => {
  return await AsyncStorage.setItem(
    credentialsKey,
    JSON.stringify({
      username,
      password,
    }),
  );
};

export const clearCredentials = async () => {
  return await AsyncStorage.removeItem(credentialsKey);
};

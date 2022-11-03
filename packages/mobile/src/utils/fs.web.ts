import AsyncStorage from '@react-native-async-storage/async-storage';

const credentialsKey = '@credentials';

export const getDocumentsPath = () => {
  return null;
};

export const appendFile = async (path: string, content: string) => {
  console.warn('FILESYSTEM MODULE FOR WEB NOT IMPLEMENTED');
};

export const getCredentials = async () => {
  const res = await AsyncStorage.getItem(credentialsKey);
  if (res) {
    return JSON.parse(res);
  }
  return undefined;
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

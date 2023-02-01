import {Linking} from 'react-native';
import {genericPlatform} from './platform';
import {_globalTauri} from './tauri-wrap';

const openURL = async (url: string): Promise<void> => {
  if (genericPlatform === 'desktop') {
    await _globalTauri.shell.open(url);
  } else {
    await Linking.openURL(url);
  }
};

export default openURL;

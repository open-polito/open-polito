import {open} from '@tauri-apps/api/shell';
import {Linking} from 'react-native';
import {genericPlatform} from './platform';

const openURL = async (url: string): Promise<void> => {
  if (genericPlatform === 'desktop') {
    await open(url);
  } else {
    await Linking.openURL(url);
  }
};

export default openURL;

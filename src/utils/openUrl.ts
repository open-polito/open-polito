import {open} from '@tauri-apps/api/shell';
import {Linking} from 'react-native';
import {getPlatform} from './platform';

const openURL = async (url: string): Promise<void> => {
  const platform = getPlatform();
  if (platform === 'desktop') {
    await open(url);
  } else {
    await Linking.openURL(url);
  }
};

export default openURL;

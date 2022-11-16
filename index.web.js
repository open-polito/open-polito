import {registerRootComponent} from 'expo';
import AppWeb from './src/AppWeb';

// FIXME need reanimated update, see https://github.com/software-mansion/react-native-reanimated/issues/3355
if (process.browser) {
  // @ts-ignore
  window._frameTimestamp = null;
}

registerRootComponent(AppWeb);

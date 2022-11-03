import Analytics from 'appcenter-analytics';
import Config from 'react-native-config';
import App from './src/App';
import CodePush from 'react-native-code-push';
import {registerRootComponent} from 'expo';
import {Platform} from 'react-native';

const VARIANT = Config.VARIANT;
const ENABLE_CODEPUSH = Platform.OS === 'android' && VARIANT != 'debug'; // disable CodePush in debug mode

if (ENABLE_CODEPUSH) Analytics.setEnabled(true);

registerRootComponent(ENABLE_CODEPUSH ? CodePush(App) : App);

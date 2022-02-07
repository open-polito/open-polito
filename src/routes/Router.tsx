import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {ActivityIndicator, StatusBar, View} from 'react-native';
import {TextL, TextS, TextXL} from '../components/Text';
import LoginScreen from '../screens/LoginScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Device} from 'open-polito-api';
import * as Keychain from 'react-native-keychain';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import RNFS from 'react-native-fs';

import {useSelector, useDispatch} from 'react-redux';
import {
  DeviceInfo,
  login,
  LoginData,
  setAuthStatus,
  setConfigState,
} from '../store/sessionSlice';
import HomeRouter from './HomeRouter';
import {showMessage} from 'react-native-flash-message';
import {loginErrorFlashMessage} from '../components/CustomFlashMessages';
import MaterialSearch from '../screens/MaterialSearch';
import Courses from '../screens/Courses';
import Course from '../screens/Course';
import VideoPlayer from '../screens/VideoPlayer';
import ExamSessions from '../screens/ExamSessions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultConfig, {Configuration} from '../defaultConfig';
import moment from 'moment';
import {Entry} from 'open-polito-api/device';
import {AuthStatus, AUTH_STATUS} from '../store/status';
import {RootState} from '../store/store';
import {DeviceContext} from '../context/Device';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../components/Button';
import {ping} from 'open-polito-api/utils';
import Config from 'react-native-config';

/**
 * Types for React Navigation
 */
export type AuthStackParamList = {
  Login: undefined;
};

export type AppStackParamList = {
  HomeRouter: undefined;
  MaterialSearch: undefined;
  ExamSessions: undefined;
  Courses: undefined;
  Course: undefined;
  VideoPlayer: undefined;
};

/**
 * Stack navigators
 */
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

/**
 * Generate filename and compute log file path
 */
const logFilename =
  'request_log-' + moment().format('YYYY-MM-DD-THHmmssSSS') + '.txt';
const logs_path =
  (RNFS.ExternalDirectoryPath || RNFS.DocumentDirectoryPath) +
  '/' +
  logFilename;

/**
 * Log requests to log file.
 * @param entry The log entry
 *
 * @remarks
 * Uses ExternalDirectoryPath (/storage/emulated/0/Android/data/org.openpolito.app/files/) on Android,
 * DocumentDirectoryPath on iOS
 */
export const requestLogger = (entry: Entry) => {
  if (entry.endpoint.includes('login')) return;
  if (!parseInt(Config.ENABLE_DEBUG_OPTIONS)) return;
  RNFS.appendFile(logs_path, JSON.stringify(entry)).catch(err =>
    console.log(err),
  );
};

// Get logging configuration
export const getLoggingConfig = async () => {
  let loggingEnabled = false;
  try {
    const loggingConfig = await AsyncStorage.getItem('@config');
    if (loggingConfig == null) {
      await AsyncStorage.setItem('@config', JSON.stringify(defaultConfig));
      loggingEnabled = defaultConfig.logging;
    } else {
      loggingEnabled = JSON.parse(loggingConfig).logging;
    }
  } catch (e) {
  } finally {
    return loggingEnabled;
  }
};

/**
 * Main routing component. Manages login and access to {@link AuthStack} and {@link AppStack}.
 */
export default function Router() {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const authStatus = useSelector<RootState, AuthStatus>(
    state => state.session.authStatus,
  );

  const deviceContext = useContext(DeviceContext);

  // Logging-related stuff
  const [loggingEnabled, setLoggingEnabled] = useState(false);
  const [message, setMessage] = useState(<View></View>);

  // Initial setup
  useEffect(() => {
    (async () => {
      // Set config in store
      dispatch(
        setConfigState(
          (JSON.parse((await AsyncStorage.getItem('@config')) || '{}') ||
            defaultConfig) as Configuration,
        ),
      );

      // Get logging configuration
      setLoggingEnabled(await getLoggingConfig());

      // Try to access with Keychain credentials, if present
      const keychainCredentials = await Keychain.getGenericPassword();

      if (keychainCredentials) {
        const {username, password} = keychainCredentials;
        const {uuid, token} = JSON.parse(password);

        // Up to this point the global Device is just a placeholder, therefore
        // we create the actual instance, set it globally, and use it to login
        const device = new Device(
          uuid,
          10000,
          loggingEnabled ? requestLogger : () => {},
        );

        // Set device instance
        deviceContext.setDevice(device);

        dispatch(
          login({
            method: 'token',
            username: keychainCredentials.username,
            token: token,
            device: device,
          }),
        );
      } else {
        /**
         * If keychain credentials not present:
         * - if network error, set offline
         * - otherwise, redirect to login screen
         */
        try {
          await ping();
          dispatch(setAuthStatus(AUTH_STATUS.NOT_VALID));
        } catch (e) {
          dispatch(setAuthStatus(AUTH_STATUS.OFFLINE));
        }
      }
    })();

    return () => {
      // Cleanup
    };
  }, []);

  // If loggingEnabled changes, set whether to show top message
  useEffect(() => {
    loggingEnabled
      ? setMessage(buildMessage({text: t('Logging enabled'), type: 'warn'}))
      : setMessage(<View></View>);
  }, [loggingEnabled]);

  // Returns message component
  const buildMessage = ({text = '', type = 'warn'}) => {
    return (
      <View
        style={{
          backgroundColor: type == 'warn' ? colors.orange : colors.black,
          paddingVertical: 4,
          paddingTop: StatusBar.currentHeight,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <TextS weight="medium" text={text} color={colors.white} />
      </View>
    );
  };

  /**
   * Quick splash screen.
   * Shown if authStatus is PENDING
   */
  // TODO better design
  return authStatus == AUTH_STATUS.PENDING ||
    authStatus == AUTH_STATUS.OFFLINE ? (
    <View style={{flex: 1}}>
      <LinearGradient
        colors={[colors.gradient1, colors.gradient2]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={{flex: 1}}>
        <SafeAreaView style={{flex: 1}}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              position: 'relative',
            }}>
            {authStatus == AUTH_STATUS.PENDING ? (
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingBottom: 64,
                }}>
                <TextXL text={t('appName')} color="white" weight="bold" />
                <View style={{position: 'absolute', bottom: 0}}>
                  {authStatus == AUTH_STATUS.PENDING && (
                    <ActivityIndicator size={48} color={colors.white} />
                  )}
                </View>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingBottom: 64,
                  marginHorizontal: 64,
                }}>
                <Icon name="wifi-off" color={colors.white} size={64} />
                <TextL text={t('networkError')} color="white" weight="bold" />
                <TextS
                  text={t('networkErrorDesc')}
                  color="white"
                  style={{textAlign: 'center'}}
                />
                {/* <Button
                  icon="reload"
                  text={t('retry')}
                  onPress={() => {
                    dispatch(setAuthStatus(AUTH_STATUS.PENDING));
                  }}
                  backgroundColor={colors.white}
                  color={colors.gradient1}
                  style={{flex: 0, marginTop: 16}}
                /> */}
              </View>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  ) : (
    <NavigationContainer>
      <View>{message}</View>
      {authStatus == AUTH_STATUS.VALID ? (
        <AppStack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <AppStack.Screen name="HomeRouter" component={HomeRouter} />
          <AppStack.Screen name="MaterialSearch" component={MaterialSearch} />
          <AppStack.Screen name="Courses" component={Courses} />
          <AppStack.Screen name="Course" component={Course} />
          <AppStack.Screen name="VideoPlayer" component={VideoPlayer} />
          <AppStack.Screen name="ExamSessions" component={ExamSessions} />
        </AppStack.Navigator>
      ) : authStatus == AUTH_STATUS.NOT_VALID ? (
        <AuthStack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
        </AuthStack.Navigator>
      ) : null}
    </NavigationContainer>
  );
}

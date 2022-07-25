import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar, View} from 'react-native';
import {TextS} from '../components/Text';
import LoginScreen from '../screens/LoginScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import colors from '../colors';
import {useTranslation} from 'react-i18next';
import RNFS from 'react-native-fs';

import {useSelector, useDispatch} from 'react-redux';
import {SessionState, setConfig, setConfigState} from '../store/sessionSlice';
import HomeRouter from './HomeRouter';
import Search from '../screens/Search';
import Course from '../screens/Course';
import Video from '../screens/Video';
import ExamSessions from '../screens/ExamSessions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultConfig, {
  Configuration,
  CONFIG_SCHEMA_VERSION,
} from '../defaultConfig';
import moment from 'moment';
import {Entry} from 'open-polito-api/device';
import {AUTH_STATUS} from '../store/status';
import {AppDispatch, RootState} from '../store/store';
import {DeviceContext} from '../context/Device';
import Config from 'react-native-config';

/**
 * Types for React Navigation
 */
export type AuthStackParamList = {
  Login: undefined;
};

export type AppStackParamList = {
  HomeRouter: undefined;
  Search: undefined;
  Course: undefined;
  Video: undefined;
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
  if (!parseInt(Config.ENABLE_DEBUG_OPTIONS)) return;
  if (entry.endpoint.includes('login')) return;
  (async () => {
    await RNFS.appendFile(logs_path, JSON.stringify(entry)).catch(err =>
      console.log(err),
    );
  })();
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
  const dispatch = useDispatch<AppDispatch>();

  const {authStatus, loginStatus, config} = useSelector<
    RootState,
    SessionState
  >(state => state.session);

  const deviceContext = useContext(DeviceContext);

  // Logging-related stuff
  const [loggingEnabled, setLoggingEnabled] = useState(false);
  const [message, setMessage] = useState(<View></View>);

  // When auth status changes, update login setting accordingly
  useEffect(() => {
    if (authStatus == AUTH_STATUS.NOT_VALID) {
      dispatch(setConfig({...config, login: false}));
    } else if (authStatus == AUTH_STATUS.VALID) {
      dispatch(setConfig({...config, login: true}));
    }
  }, [authStatus]);

  // Initial setup
  useEffect(() => {
    (async () => {
      // Set config in store
      let loadedConfig = (JSON.parse(
        (await AsyncStorage.getItem('@config')) || '{}',
      ) || defaultConfig) as Configuration;

      /**
       * Check for old schema and/or new default settings items.
       * TODO implement the following:
       * - settings json should have depth 1
       * - it should just assign the default value when not found in storage
       */
      if (
        !loadedConfig.schemaVersion ||
        loadedConfig.schemaVersion != CONFIG_SCHEMA_VERSION
      ) {
        const currentSettingsKeys = Object.keys(loadedConfig);
        const defaultSettingsKeys = Object.keys(defaultConfig);

        // Delete settings that have been deleted in default config
        const toDelete = currentSettingsKeys.filter(
          k => !defaultSettingsKeys.includes(k),
        );
        toDelete.forEach(k => delete (loadedConfig as any)[k]);

        // Add missing new settings with their default value
        dispatch(setConfig({...loadedConfig, ...defaultConfig}));
      } else {
        dispatch(setConfigState(loadedConfig));
      }

      // Get logging configuration
      const _loggingEnabled = await getLoggingConfig();
      setLoggingEnabled(_loggingEnabled);
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
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <TextS weight="medium" text={text} color={colors.white} />
      </View>
    );
  };

  return (
    <NavigationContainer>
      <View>{message}</View>
      {config.login ? (
        <AppStack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <AppStack.Screen name="HomeRouter" component={HomeRouter} />
          <AppStack.Screen name="Search" component={Search} />
          <AppStack.Screen name="Course" component={Course} />
          <AppStack.Screen name="Video" component={Video} />
        </AppStack.Navigator>
      ) : (
        <AuthStack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}

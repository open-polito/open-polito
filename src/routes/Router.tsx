import React, {useEffect, useRef, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Dimensions, Platform, StatusBar, View} from 'react-native';
import {TextS, TextXL} from '../components/Text';
import LoginScreen from '../screens/LoginScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Device} from 'open-polito-api';
import * as Keychain from 'react-native-keychain';
import 'react-native-get-random-values';
import {v4 as UUIDv4} from 'uuid';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import RNFS from 'react-native-fs';

import {useSelector, useDispatch} from 'react-redux';
import {
  setUsername,
  setToken,
  setUuid,
  setUser,
  setAccess,
  setLoadedToken,
} from '../store/sessionSlice';
import {setWindowHeight} from '../store/uiSlice';
import {setUnreadEmailCount} from '../store/emailSlice';
import HomeRouter from './HomeRouter';
import {showMessage} from 'react-native-flash-message';
import {
  loginErrorFlashMessage,
  loginPendingFlashMessage,
  loginSuccessFlashMessage,
} from '../components/CustomFlashMessages';
import UserProvider from '../context/User';
import MaterialSearch from '../screens/MaterialSearch';
import Courses from '../screens/Courses';
import Course from '../screens/Course';
import VideoPlayer from '../screens/VideoPlayer';
import ExamSessions from '../screens/ExamSessions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultConfig from '../defaultConfig';
import moment from 'moment';

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

const logFilename =
  'request_log-' + moment().format('YYYY-MM-DD-THHmmssSSS') + '.txt';
const logs_path =
  (RNFS.ExternalDirectoryPath || RNFS.DocumentDirectoryPath) +
  '/' +
  logFilename;

// console.log(`Request log path: ${logs_path}`);
function log_request(entry) {
  // Uses ExternalDirectoryPath (/storage/emulated/0/Android/data/org.openpolito.app/files/) on Android,
  // DocumentDirectoryPath on iOS
  // console.log(entry);
  if (entry.endpoint.includes('login')) return;
  RNFS.appendFile(logs_path, JSON.stringify(entry)).catch(err =>
    console.log(err),
  );
}

export default function Router() {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const [_user, _setUser] = useState();
  const [logging, setLogging] = useState(false);
  const [message, setMessage] = useState(null);

  const {access, loadedToken} = useSelector(state => state.session);

  const [height, setHeight] = useState(() => {
    h = Dimensions.get('window').height + StatusBar.currentHeight;
    dispatch(setWindowHeight(h));
    return h;
  });

  // Initial setup
  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({window}) => {
      dispatch(setWindowHeight(window + StatusBar.currentHeight));
    });

    return () => {
      sub.remove();
    };
  }, []);

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

  function handleLogin(username, password) {
    showMessage(loginPendingFlashMessage(t));
    (async () => {
      // todo: disable logging in release mode
      const device = new Device(UUIDv4(), log_request);
      // console.log(device.uuid);
      const deviceData = {
        platform: Platform.OS,
        version: Platform.Version + '',
        model: 'Generic',
        manufacturer: 'Unknown',
      };
      try {
        await device.register(deviceData);
        const {user, token} = await device.loginWithCredentials(
          username,
          password,
        );

        const sessionUsername = 'S' + user.anagrafica.matricola;

        const item = JSON.stringify({uuid: device.uuid, token: token});

        await Keychain.setGenericPassword(sessionUsername, item);

        dispatch(setUuid(device.uuid));
        dispatch(setUsername(sessionUsername));
        dispatch(setToken(token));
        dispatch(setUser(user.anagrafica));

        _setUser(user);

        const {unread} = await user.unreadMail();
        dispatch(setUnreadEmailCount(unread));

        dispatch(setAccess(true));
        showMessage(loginSuccessFlashMessage(t));
      } catch (error) {
        // TODO custom alert component
        // TODO better error handling
        // console.log(error);
        showMessage(loginErrorFlashMessage(t));
      }
    })();
  }

  // Get logging configuration
  const getLoggingConfig = async () => {
    let _logging = false;
    try {
      _logging = await AsyncStorage.getItem('@config');
      if (_logging == null) {
        await AsyncStorage.setItem('@config', JSON.stringify(defaultConfig));
        _logging = defaultConfig.logging;
      } else {
        _logging = JSON.parse(_logging).logging;
      }
    } catch (e) {
    } finally {
      setLogging(_logging);
    }

    // Determine whether to show top message
    _logging &&
      setMessage(buildMessage({text: t('Logging enabled'), type: 'warn'}));

    return _logging;
  };

  // Get access token from keychain
  useEffect(() => {
    if (!access) {
      showMessage(loginPendingFlashMessage(t));
      // only log in again if not logged in yet (with token) (to prevent unnecessary token changes during development)
      setTimeout(async () => {
        const _logging = await getLoggingConfig();
        try {
          // console.log('Accessing token...');
          const credentials = await Keychain.getGenericPassword();
          if (credentials) {
            dispatch(setUsername(credentials.username));
            const {uuid, token} = JSON.parse(credentials.password);
            dispatch(setToken(token));
            dispatch(setUuid(uuid));

            // todo: disable logging in release mode
            const dev = new Device(uuid, _logging ? log_request : () => {});
            const {user, token: newToken} = await dev.loginWithToken(
              credentials.username,
              token,
            );

            const sessionUsername = 'S' + user.anagrafica.matricola;

            const item = JSON.stringify({uuid: dev.uuid, token: newToken});

            await Keychain.setGenericPassword(sessionUsername, item);

            dispatch(setToken(newToken));
            dispatch(setUser(user.anagrafica));

            _setUser(user);

            dispatch(setLoadedToken(true));
            dispatch(setAccess(true));

            showMessage(loginSuccessFlashMessage(t));

            const {unread} = await user.unreadMail();
            dispatch(setUnreadEmailCount(unread));

            // REMOVE IN PRODUCTION!
            // console.log(uuid, token);
          } else {
            // console.log('No credentials found!');
            dispatch(setLoadedToken(true));
            dispatch(setAccess(false));
          }
        } catch (error) {
          dispatch(setLoadedToken(false));
          dispatch(setAccess(false));
          showMessage(loginErrorFlashMessage(t));
        }
      }, 500);
    }
  }, []);

  /**
   * Quick splash screen.
   * Active until it has been determined whether access token exists
   * or if it is valid or not.
   */
  // TODO better design
  if (!loadedToken) {
    return (
      <View style={{flex: 1}}>
        <LinearGradient
          colors={[colors.gradient1, colors.gradient2]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          height={height}>
          <SafeAreaView>
            <StatusBar
              translucent
              backgroundColor="transparent"
              barStyle="light-content"
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '95%',
              }}>
              <TextXL text="Open PoliTo" color="white" weight="bold" />
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <View>{message}</View>
      {access ? (
        <UserProvider user={_user}>
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
        </UserProvider>
      ) : (
        <AuthStack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <AuthStack.Screen name="Login">
            {props => <LoginScreen {...props} loginFunction={handleLogin} />}
          </AuthStack.Screen>
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}

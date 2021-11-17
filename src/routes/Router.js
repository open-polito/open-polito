import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Dimensions, ImageBackground, Platform, StatusBar} from 'react-native';
import {TextTitle} from '../components/Text';
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

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

export default function Router() {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const [_user, _setUser] = useState();

  const [height, setHeight] = useState(() => {
    h = Dimensions.get('window').height + StatusBar.currentHeight;
    dispatch(setWindowHeight(h));
    return h;
  });

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({window}) => {
      dispatch(setWindowHeight(window + StatusBar.currentHeight));
    });
    return () => sub.remove();
  });

  const {access, loadedToken} = useSelector(state => state.session);
  // const {unreadEmailCount} = useSelector(state => state.email);

  function handleLogin(username, password) {
    showMessage(loginPendingFlashMessage(t));
    (async () => {
      const device = new Device();
      device.uuid = await UUIDv4();
      // console.log(device.uuid);
      const deviceData = {
        platform: Platform.OS,
        version: Platform.Version,
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

  // Get access token from keychain
  useEffect(() => {
    if (!access) {
      showMessage(loginPendingFlashMessage(t));
      // only log in again if not logged in yet (with token) (to prevent unnecessary token changes during development)
      setTimeout(async () => {
        try {
          // console.log('Accessing token...');
          const credentials = await Keychain.getGenericPassword();
          if (credentials) {
            dispatch(setUsername(credentials.username));
            const {uuid, token} = JSON.parse(credentials.password);
            dispatch(setToken(token));
            dispatch(setUuid(uuid));

            const dev = new Device(uuid);
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
      <LinearGradient
        colors={[colors.gradient1, colors.gradient2]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        height={height}>
        <ImageBackground
          style={{height: '100%'}}
          source={require('../../assets/images/background.png')}>
          <SafeAreaView>
            <StatusBar
              translucent
              backgroundColor="transparent"
              barStyle="light-content"
            />

            <TextTitle
              text={t('loading')}
              color="white"
              style={{marginTop: 200, width: '100%', textAlign: 'center'}}
            />
          </SafeAreaView>
        </ImageBackground>
      </LinearGradient>
    );
  }

  return (
    <NavigationContainer>
      {access ? (
        <UserProvider user={_user}>
          <AppStack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            <AppStack.Screen name="HomeRouter" component={HomeRouter} />
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

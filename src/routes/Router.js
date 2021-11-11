import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  Alert,
  Dimensions,
  ImageBackground,
  Platform,
  StatusBar,
} from 'react-native';
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

import {useSelector, useDispatch} from 'react-redux';
import {setUsername, setToken, setUuid, setUser} from '../store/sessionSlice';
import HomeRouter from './HomeRouter';

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

export default function Router() {
  const [loadedToken, setLoadedToken] = useState(false);

  const [access, setAccess] = useState(false);

  const [height] = useState(
    Dimensions.get('window').height + StatusBar.currentHeight,
  );

  const {uuid} = useSelector(state => state.session);
  const dispatch = useDispatch();

  function handleLogin(username, password) {
    (async () => {
      const device = new Device();
      device.uuid = UUIDv4();
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
        // console.log(user, token);

        _username = 'S' + user.anagrafica.matricola;

        item = JSON.stringify({uuid: uuid, token: token});
        await Keychain.setGenericPassword(_username, item);

        dispatch(setUuid(device.uuid));
        dispatch(setUsername(_username));
        dispatch(setToken(token));
        dispatch(setUser(JSON.stringify(user)));

        console.log(session);
      } catch (error) {
        // TODO custom alert component
        // TODO better error handling
        Alert.alert(
          'Login error',
          'Your username/password may be incorrect or Internet connection is not available',
        );
      }
    })();
  }

  // Get access token from keychain
  useEffect(() => {
    setTimeout(async () => {
      try {
        // console.log('Accessing token...');
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          setAccess(true);
          // console.log(credentials);
          setLoadedToken(true);
          dispatch(setUsername(credentials.username));
          const {_uuid, _token} = JSON.parse(credentials.password);
          dispatch(setToken(_token));
          dispatch(setUuid(_uuid));
        } else {
          // console.log('No credentials found!');
          setLoadedToken(true);
          setAccess(false);
        }
      } catch (error) {
        setLoadedToken(true);
        setAccess(false);
        // console.log('Error!');
      }
    }, 1000);
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
            <StatusBar translucent backgroundColor="transparent" />

            <TextTitle
              text="Loading..."
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
        <AppStack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <AppStack.Screen name="HomeRouter" component={HomeRouter} />
        </AppStack.Navigator>
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

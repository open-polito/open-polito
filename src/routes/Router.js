import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {ImageBackground, Platform, View} from 'react-native';
import {TextTitle} from '../components/Text';
import LoginScreen from '../screens/LoginScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Device} from 'open-polito-api';
import * as Keychain from 'react-native-keychain';
import Home from '../screens/Home';
import 'react-native-get-random-values';
import {v4 as UUIDv4} from 'uuid';

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

export default function Router() {
  const [loadedToken, setLoadedToken] = useState(false);

  const [access, setAccess] = useState(false);

  /**
   * TODO fix api
   * "open-polito-api" uses "node-fetch", which doesn't work in React Native.
   * To get everything working, edit "utils.ts" from "open-polito-api" and remove
   * the first six lines, then recompile the module with "tsc index.ts"
   */
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
      await device.register(deviceData);
      const {user, token} = await device.loginWithCredentials(
        username,
        password,
      );
      // console.log(user, token);
      await Keychain.setGenericPassword('S' + user.anagrafica.matricola, token);
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
      <View>
        <ImageBackground
          style={{height: '100%'}}
          source={require('../../assets/images/background.png')}>
          <TextTitle
            text="Loading..."
            color="white"
            style={{marginTop: 200, width: '100%', textAlign: 'center'}}
          />
        </ImageBackground>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {access ? (
        <AppStack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <AppStack.Screen name="Home" component={Home} />
        </AppStack.Navigator>
      ) : (
        <AuthStack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          {/* <AuthStack.Screen name="Login" component={LoginScreen} /> */}
          <AuthStack.Screen name="Login">
            {props => <LoginScreen {...props} loginFunction={handleLogin} />}
          </AuthStack.Screen>
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {View} from 'react-native';
import LoginScreen from './src/screens/LoginScreen';

const Stack = createNativeStackNavigator();

function Test() {
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'white'}}></View>
      <View style={{flex: 1, backgroundColor: 'black'}}></View>
      <View style={{flex: 1, backgroundColor: 'magenta'}}></View>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {/* <Stack.Screen name="Test" component={Test} /> */}
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

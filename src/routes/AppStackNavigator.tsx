import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Course from '../screens/Course';
import Search from '../screens/Search';
import Video from '../screens/Video';
import HomeRouter from './HomeRouter';

export type AppStackParamList = {
  HomeRouter: undefined;
  Search: undefined;
  Course: undefined;
  Video: undefined;
};

const AppStack = createNativeStackNavigator<AppStackParamList>();

const AppStackNavigator = () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <AppStack.Screen name="HomeRouter" component={HomeRouter} />
        <AppStack.Screen name="Search" component={Search} />
        <AppStack.Screen name="Course" component={Course} />
        <AppStack.Screen name="Video" component={Video} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default AppStackNavigator;

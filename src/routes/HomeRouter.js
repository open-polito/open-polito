import React from 'react';
import styles from '../styles';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Email from '../screens/Email';
import Settings from '../screens/Settings';
import colors from '../colors';
import {useSelector} from 'react-redux';
import IconBadge from '../components/IconBadge';

export default function HomeRouter() {
  const {unreadEmailCount} = useSelector(state => state.email);

  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabNavigator,
        tabBarActiveTintColor: colors.gradient1,
        tabBarInactiveTintColor: colors.gray,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => {
            return <IconBadge name="home" color={color} size={size} />;
          },
        }}
      />
      <Tab.Screen
        name="E-mail"
        component={Email}
        options={{
          tabBarLabel: 'E-mail',
          tabBarIcon: ({color, size}) => {
            return (
              <IconBadge
                name="email"
                color={color}
                size={size}
                number={unreadEmailCount}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({color, size}) => {
            return <IconBadge name="settings" color={color} size={size} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

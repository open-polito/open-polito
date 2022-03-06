import React, {useContext, useEffect} from 'react';
import styles from '../styles';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Email from '../screens/Email';
import Settings from '../screens/Settings';
import colors from '../colors';
import {useDispatch, useSelector} from 'react-redux';
import IconBadge from '../components/IconBadge';
import {useTranslation} from 'react-i18next';
import Material from '../screens/Material';
import {RootState} from '../store/store';
import {loadCoursesData} from '../store/coursesSlice';
import {DeviceContext} from '../context/Device';
import {getUnreadEmailCount} from '../store/userSlice';
import {
  NotificationType,
  parsePushNotification,
  registerPushNotifications,
} from 'open-polito-api/notifications';

import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {infoFlashMessage} from '../components/CustomFlashMessages';
import Config from 'react-native-config';
import Analytics from 'appcenter-analytics';

export type TabNavigatorParamList = {
  Home: undefined;
  Material: undefined;
  'E-mail': undefined;
  Settings: undefined;
};

export default function HomeRouter() {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const deviceContext = useContext(DeviceContext);

  const unreadEmailCount = useSelector<RootState, number>(
    state => state.user.unreadEmailCount,
  );

  const Tab = createBottomTabNavigator<TabNavigatorParamList>();

  /**
   * Load initial data
   */
  useEffect(() => {
    dispatch(loadCoursesData(deviceContext.device));
    dispatch(getUnreadEmailCount(deviceContext.device));

    /**
     * After user successfully logged in, register FCM notifications
     * with current messaging token.
     * TODO iOS support.
     */
    (async () => {
      if (Platform.OS == 'android' && Config.VARIANT != 'debug') {
        const FCMToken = await messaging().getToken();
        await registerPushNotifications(deviceContext.device, FCMToken);
      }
    })();

    /**
     * Setup FCM handler for notifications received while in app.
     * Show flash message.
     * TODO add iOS support.
     */
    const unsubscribe =
      Platform.OS == 'android' && Config.VARIANT != 'debug'
        ? messaging().onMessage(async remoteMessage => {
            const msg = parsePushNotification(remoteMessage.data);
            showMessage(
              infoFlashMessage(msg.topic + ': ' + msg.title, msg.text),
            );
            await Analytics.trackEvent('push_foreground', {
              test: msg.topic == NotificationType.TEST ? 'true' : 'false',
            });
          })
        : () => {};

    return unsubscribe;
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabNavigator,
        tabBarActiveTintColor: colors.gradient1,
        tabBarInactiveTintColor: colors.gray,
        unmountOnBlur: true,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: t('home'),
          tabBarIcon: ({color, size}) => {
            return <IconBadge name="home-outline" color={color} size={size} />;
          },
        }}
      />
      <Tab.Screen
        name="Material"
        component={Material}
        options={{
          tabBarLabel: t('material'),
          tabBarIcon: ({color, size}) => {
            return (
              <IconBadge name="folder-outline" color={color} size={size} />
            );
          },
        }}
      />
      <Tab.Screen
        name="E-mail"
        component={Email}
        options={{
          tabBarLabel: t('email'),
          tabBarIcon: ({color, size}) => {
            return (
              <IconBadge
                name="email-outline"
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
          tabBarLabel: t('settings'),
          tabBarIcon: ({color, size}) => {
            return <IconBadge name="cog-outline" color={color} size={size} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

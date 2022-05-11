import React, {useContext, useEffect} from 'react';
import styles from '../styles';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens_legacy/Home';
import Email from '../screens_legacy/Email';
import Settings from '../screens_legacy/Settings';
import colors from '../colors';
import {useDispatch, useSelector} from 'react-redux';
import IconBadge from '../components/IconBadge';
import {useTranslation} from 'react-i18next';
import Material from '../screens_legacy/Material';
import {RootState} from '../store/store';
import {loadCoursesData} from '../store/coursesSlice';
import {DeviceContext} from '../context/Device';
import {getNotificationList, getUnreadEmailCount} from '../store/userSlice';
import {
  parsePushNotification,
  PushNotification,
  registerPushNotifications,
} from 'open-polito-api/notifications';

import {NativeModules, Platform, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {infoFlashMessage} from '../components/CustomFlashMessages';
import Config from 'react-native-config';
import {STATUS, Status} from '../store/status';
import Analytics from 'appcenter-analytics';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Drawer from '../ui/core/Drawer';
import {SessionState} from '../store/sessionSlice';
import Bookings from '../screens_legacy/Bookings';
import Timetable from '../screens_legacy/Timetable';
import Exams from '../screens_legacy/Exams';
import ExamSessions from '../screens_legacy/ExamSessions';
import Maps from '../screens/Maps';
import Classrooms from '../screens/Classrooms';
import People from '../screens/People';
import Courses from '../screens_legacy/Courses';

export type DrawerStackParamList = {
  Home: undefined;
  Material: undefined;
  Email: undefined;
  Settings: undefined;
  ExamSessions: undefined;
  Timetable: undefined;
  Exams: undefined;
  Bookings: undefined;
  Courses: undefined;
  Maps: undefined;
  People: undefined;
  Classrooms: undefined;
};

const DrawerStack = createDrawerNavigator<DrawerStackParamList>();

export default function HomeRouter() {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {dark, device} = useContext(DeviceContext);

  const unreadEmailCount = useSelector<RootState, number>(
    state => state.user.unreadEmailCount,
  );

  const getNotificationsStatus = useSelector<RootState, Status>(
    state => state.user.getNotificationsStatus,
  );

  /**
   * Whenever notifications status is set to IDLE,
   * load them again
   */
  useEffect(() => {
    if (getNotificationsStatus.code != STATUS.IDLE) return;
    dispatch(getNotificationList(device));
  }, [getNotificationsStatus]);

  /**
   * Load initial data
   */
  useEffect(() => {
    dispatch(loadCoursesData(device));
    dispatch(getUnreadEmailCount(device));

    /**
     * After user successfully logged in, register FCM notifications
     * with current messaging token.
     * TODO iOS support.
     */
    (async () => {
      if (Platform.OS == 'android' && Config.VARIANT != 'debug') {
        const FCMToken = await NativeModules.NotificationModule.getToken();
        await registerPushNotifications(device, FCMToken);
        await Analytics.trackEvent('fcm_registered');
      }
    })();

    return () => {};
  }, []);

  return (
    <DrawerStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={props => <Drawer dark={dark} {...props} />}>
      <DrawerStack.Screen name="Home" component={Home} />
      <DrawerStack.Screen name="Email" component={Email} />
      <DrawerStack.Screen name="Settings" component={Settings} />
      <DrawerStack.Screen name="Courses" component={Courses} />
      <DrawerStack.Screen name="Material" component={Material} />
      <DrawerStack.Screen name="Bookings" component={Bookings} />
      <DrawerStack.Screen name="Timetable" component={Timetable} />
      <DrawerStack.Screen name="Exams" component={Exams} />
      <DrawerStack.Screen name="ExamSessions" component={ExamSessions} />
      <DrawerStack.Screen name="Maps" component={Maps} />
      <DrawerStack.Screen name="Classrooms" component={Classrooms} />
      <DrawerStack.Screen name="People" component={People} />
    </DrawerStack.Navigator>
  );
}

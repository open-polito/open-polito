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
import {AppDispatch, RootState} from '../store/store';
import {
  CoursesState,
  getRecentMaterial,
  loadCourse,
  loadCoursesData,
  setLoadExtendedCourseInfoStatus,
} from '../store/coursesSlice';
import {DeviceContext} from '../context/Device';
import {
  getNotificationList,
  getUnreadEmailCount,
  UserState,
} from '../store/userSlice';
import {
  parsePushNotification,
  PushNotification,
  registerPushNotifications,
} from 'open-polito-api/notifications';

import {NativeModules, Platform, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {infoFlashMessage} from '../components/CustomFlashMessages';
import Config from 'react-native-config';
import {pendingStatus, STATUS, Status, successStatus} from '../store/status';
import Analytics from 'appcenter-analytics';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Drawer from '../ui/Drawer';
import {login, SessionState} from '../store/sessionSlice';
import Bookings from '../screens_legacy/Bookings';
import Timetable from '../screens_legacy/Timetable';
import Exams from '../screens/Exams';
import ExamSessions from '../screens/ExamSessions';
import Maps from '../screens/Maps';
import Classrooms from '../screens/Classrooms';
import People from '../screens/People';
import Courses from '../screens/Courses';
import {getLoggingConfig, requestLogger} from './Router';
import Keychain from 'react-native-keychain';
import {Device} from 'open-polito-api/device';

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
  const dispatch = useDispatch<AppDispatch>();
  const {dark, device, setDevice} = useContext(DeviceContext);

  const {unreadEmailCount, getNotificationsStatus} = useSelector<
    RootState,
    UserState
  >(state => state.user);

  const {loginStatus} = useSelector<RootState, SessionState>(
    state => state.session,
  );

  const {courses, recentMaterial, getRecentMaterialStatus, loadCoursesStatus} =
    useSelector<RootState, CoursesState>(state => state.courses);

  /**
   * Whenever notifications status is set to IDLE,
   * load them again
   */
  useEffect(() => {
    if (
      getNotificationsStatus.code != STATUS.IDLE ||
      loginStatus.code != STATUS.SUCCESS
    )
      return;
    dispatch(getNotificationList(device));
  }, [getNotificationsStatus, loginStatus]);

  /**
   * Load initial data
   */
  useEffect(() => {
    (async () => {
      // Try to access with Keychain credentials, if present
      const keychainCredentials = await Keychain.getGenericPassword();

      if (keychainCredentials) {
        const {username, password} = keychainCredentials;
        const {uuid, token} = JSON.parse(password);

        const _loggingEnabled = await getLoggingConfig();

        // Up to this point the global Device is just a placeholder, therefore
        // we create the actual instance, set it globally, and use it to login
        const device = new Device(
          uuid,
          10000,
          _loggingEnabled ? requestLogger : () => {},
        );

        // Set device instance
        setDevice(device);

        dispatch(
          login({
            method: 'token',
            username: keychainCredentials.username,
            token: token,
            device: device,
          }),
        );
      } else {
      }

      return () => {};
    })();
  }, []);

  /**
   * Load everything else only after login successful
   */
  useEffect(() => {
    if (loginStatus.code != STATUS.SUCCESS) return;
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
  }, [loginStatus]);

  /**
   * Load full course data when basic data loaded
   * TODO change when persistence implemented
   */
  useEffect(() => {
    (async () => {
      if (loadCoursesStatus.code != STATUS.SUCCESS) return; // Cancel if basic data not loaded
      dispatch(setLoadExtendedCourseInfoStatus(pendingStatus())); // Pending
      courses.forEach(course => {
        if (course.status.code == STATUS.IDLE) {
          dispatch(loadCourse({basicCourseInfo: course.basicInfo, device}));
        }
      });
    })();
  }, [loadCoursesStatus]);

  /**
   * When all courses fully loaded, get recent material
   */
  useEffect(() => {
    if (
      getRecentMaterialStatus.code != STATUS.IDLE ||
      loadCoursesStatus.code != STATUS.SUCCESS
    )
      return; // Cancel if already computed/computing or basic data not even loaded
    let allLoaded = true;
    courses.forEach(course => {
      if (course.status.code != STATUS.SUCCESS) allLoaded = false;
    });
    if (allLoaded) {
      dispatch(setLoadExtendedCourseInfoStatus(successStatus())); // Success
      dispatch(getRecentMaterial());
    }
  }, [courses, getRecentMaterialStatus]);

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

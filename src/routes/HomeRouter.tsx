import React, {useCallback, useContext, useEffect} from 'react';
import Home from '../screens/Home';
import Email from '../screens/Email';
import Settings from '../screens/Settings';
import {useDispatch, useSelector} from 'react-redux';
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
import {registerPushNotifications} from 'open-polito-api/lib/notifications';
import {Platform} from 'react-native';
import Config from 'react-native-config';
import {pendingStatus, STATUS, successStatus} from '../store/status';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Drawer from '../ui/Drawer';
import {login, SessionState} from '../store/sessionSlice';
import Bookings from '../screens/Bookings';
import Timetable from '../screens/Timetable';
import Exams from '../screens/Exams';
import ExamSessions from '../screens/ExamSessions';
import Maps from '../screens/Maps';
import Classrooms from '../screens/Classrooms';
import People from '../screens/People';
import Courses from '../screens/Courses';
import Notifications from '../screens/Notifications';
import {DrawerContentComponentProps} from '@react-navigation/drawer';
import {DeviceSize} from '../types';
import {NotificationModule} from '../utils/native-modules';
import Downloads from '../screens/Downloads';

export type DrawerStackParamList = {
  Home: undefined;
  Material: undefined;
  Email: undefined;
  Notifications: undefined;
  Downloads: undefined;
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
  const dispatch = useDispatch<AppDispatch>();
  const {dark, device, size} = useContext(DeviceContext);

  const {getNotificationsStatus} = useSelector<RootState, UserState>(
    state => state.user,
  );

  const {loginStatus} = useSelector<RootState, SessionState>(
    state => state.session,
  );

  const {courses, getRecentMaterialStatus, loadCoursesStatus} = useSelector<
    RootState,
    CoursesState
  >(state => state.courses);

  /**
   * Login with token
   */
  useEffect(() => {
    if (loginStatus.code === STATUS.IDLE) {
      dispatch(login({method: 'token', device}));
    }
  }, [loginStatus, device, dispatch]);

  /**
   * Whenever notifications status is set to IDLE,
   * load them again
   */
  useEffect(() => {
    if (
      getNotificationsStatus.code !== STATUS.IDLE ||
      loginStatus.code !== STATUS.SUCCESS
    ) {
      return;
    }
    dispatch(getNotificationList(device));
  }, [getNotificationsStatus, loginStatus]);

  /**
   * Load everything else only after login successful
   */
  useEffect(() => {
    if (loginStatus.code !== STATUS.SUCCESS) {
      return;
    }
    dispatch(loadCoursesData(device));
    dispatch(getUnreadEmailCount(device));

    /**
     * After user successfully logged in, register FCM notifications
     * with current messaging token.
     * TODO iOS support.
     */
    (async () => {
      if (Platform.OS === 'android' && Config.VARIANT !== 'debug') {
        const FCMToken = await NotificationModule.getToken();
        await registerPushNotifications(device, FCMToken);
      }
    })();
  }, [loginStatus]);

  /**
   * Load full course data when basic data loaded
   * TODO change when persistence implemented
   */
  useEffect(() => {
    (async () => {
      if (loadCoursesStatus.code !== STATUS.SUCCESS) {
        return; // Cancel if basic data not loaded
      }
      dispatch(setLoadExtendedCourseInfoStatus(pendingStatus())); // Pending
      courses.forEach(course => {
        if (course.status.code === STATUS.IDLE) {
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
      getRecentMaterialStatus.code !== STATUS.IDLE ||
      loadCoursesStatus.code !== STATUS.SUCCESS
    ) {
      return; // Cancel if already computed/computing or basic data not even loaded
    }
    let allLoaded = true;
    courses.forEach(course => {
      if (course.status.code !== STATUS.SUCCESS) {
        allLoaded = false;
      }
    });
    if (allLoaded) {
      dispatch(setLoadExtendedCourseInfoStatus(successStatus())); // Success
      dispatch(getRecentMaterial());
    }
  }, [courses, getRecentMaterialStatus]);

  const getDrawerComponent = useCallback(
    (props: DrawerContentComponentProps) => <Drawer dark={dark} {...props} />,
    [dark],
  );

  return (
    <DrawerStack.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: size >= DeviceSize.lg ? 'permanent' : 'front',
      }}
      useLegacyImplementation
      drawerContent={props => getDrawerComponent(props)}>
      <DrawerStack.Screen name="Home" component={Home} />
      <DrawerStack.Screen name="Email" component={Email} />
      <DrawerStack.Screen name="Downloads" component={Downloads} />
      <DrawerStack.Screen name="Notifications" component={Notifications} />
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

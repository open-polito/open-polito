import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import colors from '../colors';
import ArrowHeader from '../components/ArrowHeader';
import ScreenContainer from '../components/ScreenContainer';
import {TextL, TextS, TextXL} from '../components/Text';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconC from 'react-native-vector-icons/MaterialCommunityIcons';
import CourseVideos from '../ui/CourseVideos';
import styles from '../styles';
import {useTranslation} from 'react-i18next';
import CourseOverview from '../ui/CourseOverview';
import MaterialExplorer from '../ui/MaterialExplorer';
import {useDispatch, useSelector} from 'react-redux';
import RecentItemsLoader from '../components/loaders/RecentItemsLoader';
import CourseLoader from '../components/loaders/CourseLoader';
import CourseAlerts from '../ui/CourseAlerts';
import {DeviceContext} from '../context/Device';
import {RootState} from '../store/store';
import {CourseState, loadCourse} from '../store/coursesSlice';
import {STATUS} from '../store/status';
import Screen from '../ui/Screen';
import {p} from '../scaling';
import Header, {HEADER_TYPE} from '../ui/Header';
import Tabs from '../ui/Tabs';

// TODO old videos

export default function Course({navigation, route}) {
  const dispatch = useDispatch();

  const {t} = useTranslation();

  const {device, dark} = useContext(DeviceContext);

  const code = route.params.courseCode;

  const courseData = useSelector<RootState, CourseState | undefined>(state =>
    state.courses.courses.find(
      course => course.basicInfo.code + course.basicInfo.name == code,
    ),
  );

  const [currentTab, setCurrentTab] = useState(0);

  const tabs = useMemo(() => {
    return ['overview', 'material', 'alerts', 'videos'];
  }, [courseData]);

  // Populate course data if empty
  useEffect(() => {
    if (
      courseData &&
      courseData?.status.code != STATUS.PENDING &&
      courseData?.status.code != STATUS.SUCCESS
    ) {
      dispatch(
        loadCourse({
          basicCourseInfo: courseData.basicInfo,
          device: device,
        }),
      );
    }
  }, []);

  const refresh = () => {
    dispatch(
      loadCourse({
        basicCourseInfo: courseData!.basicInfo,
        device: device,
      }),
    );
  };

  const refreshing = useMemo(() => {
    return courseData?.status.code == STATUS.PENDING;
  }, [courseData]);

  const _styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        paddingHorizontal: 16 * p,
        paddingBottom: 16 * p,
      },
    });
  }, [dark]);

  const section = useMemo(() => {
    switch (tabs[currentTab]) {
      case 'overview':
        return (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} />
            }
            style={_styles.container}>
            <View style={{height: 24 * p}} />
            <CourseOverview code={code} changeTab={setCurrentTab} />
            <View style={{height: 16 * p}} />
          </ScrollView>
        );
      case 'material':
        return (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} />
            }
            style={_styles.container}>
            <View style={{height: 24 * p}} />
            <MaterialExplorer dark={dark} courseId={code} />
            <View style={{marginBottom: 16 * p}} />
          </ScrollView>
        );
      case 'alerts':
        return (
          <CourseAlerts
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} />
            }
            dark={dark}
            alerts={courseData?.extendedInfo?.notices || []}
          />
        );
      case 'videos':
        return (
          <CourseVideos
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} />
            }
            dark={dark}
            courseId={code}
            year="-1"
          />
        );
      // case 'oldVideos':
      //   return (
      //     <CourseVideos
      //       refreshControl={
      //         <RefreshControl refreshing={refreshing} onRefresh={refresh} />
      //       }
      //       dark={dark}
      //       courseId={code}
      //       year={}
      //     />
      //   );
    }
  }, [currentTab]);

  return (
    <Screen>
      <Header
        title={courseData?.basicInfo.name || ''}
        headerType={HEADER_TYPE.SECONDARY}
      />
      <Tabs
        adjusted
        dark={dark}
        onChange={i => {
          setCurrentTab(i);
        }}
        items={tabs.map(tab => {
          return {label: t(tab), value: tab};
        })}
      />
      <View style={{flex: 1}}>{section}</View>
    </Screen>
  );
}

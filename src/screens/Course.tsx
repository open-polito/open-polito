import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import CourseVideos from '../ui/CourseVideos';
import {useTranslation} from 'react-i18next';
import CourseOverview from '../ui/CourseOverview';
import MaterialExplorer from '../ui/MaterialExplorer';
import {useDispatch, useSelector} from 'react-redux';
import CourseAlerts from '../ui/CourseAlerts';
import {DeviceContext} from '../context/Device';
import {AppDispatch, RootState} from '../store/store';
import {CourseState, loadCourse} from '../store/coursesSlice';
import {STATUS} from '../store/status';
import Screen from '../ui/Screen';
import {p} from '../scaling';
import Header, {HEADER_TYPE} from '../ui/Header';
import Tabs from '../ui/Tabs';

export default function Course({navigation, route}) {
  const dispatch = useDispatch<AppDispatch>();

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
  }, []);

  // Populate course data if empty
  useEffect(() => {
    if (
      courseData &&
      courseData?.status.code !== STATUS.PENDING &&
      courseData?.status.code !== STATUS.SUCCESS
    ) {
      dispatch(
        loadCourse({
          basicCourseInfo: courseData.basicInfo,
          device: device,
        }),
      );
    }
  }, [courseData, device, dispatch]);

  const refresh = useCallback(() => {
    dispatch(
      loadCourse({
        basicCourseInfo: courseData!.basicInfo,
        device: device,
      }),
    );
  }, [courseData, device, dispatch]);

  const refreshing = useMemo(() => {
    return courseData?.status.code === STATUS.PENDING;
  }, [courseData]);

  const _styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        paddingHorizontal: 16 * p,
        paddingBottom: 16 * p,
      },
    });
  }, []);

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
            alerts={
              courseData?.extendedInfo?.notices.map(alert => {
                return {
                  ...alert,
                  course_code: courseData.basicInfo.code,
                  course_name: courseData.basicInfo.name,
                };
              }) || []
            }
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
          />
        );
    }
  }, [
    _styles.container,
    code,
    courseData?.basicInfo.code,
    courseData?.basicInfo.name,
    courseData?.extendedInfo?.notices,
    currentTab,
    dark,
    refresh,
    refreshing,
    tabs,
  ]);

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

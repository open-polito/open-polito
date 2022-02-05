import React, {useContext, useEffect, useState} from 'react';
import {Pressable, ScrollView, View} from 'react-native';
import colors from '../colors';
import ArrowHeader from '../components/ArrowHeader';
import ScreenContainer from '../components/ScreenContainer';
import {TextL, TextS, TextXL} from '../components/Text';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconC from 'react-native-vector-icons/MaterialCommunityIcons';
import CourseVideos from '../components/CourseVideos';
import styles from '../styles';
import {useTranslation} from 'react-i18next';
import CourseOverview from '../components/CourseOverview';
import MaterialExplorer from '../components/MaterialExplorer';
import {useDispatch, useSelector} from 'react-redux';
import RecentItemsLoader from '../components/RecentItemsLoader';
import CourseLoader from '../components/CourseLoader';
import CourseAlerts from '../components/CourseAlerts';
import {DeviceContext} from '../context/Device';
import {RootState} from '../store/store';
import {
  CourseData,
  CoursesState,
  CourseState,
  loadCourse,
} from '../store/coursesSlice';
import {STATUS} from '../store/status';

export default function Course({navigation, route}) {
  const dispatch = useDispatch();

  const {t} = useTranslation();

  const deviceContext = useContext(DeviceContext);

  const code = route.params.courseCode;

  const courseData = useSelector<RootState, CourseState | undefined>(state =>
    state.courses.courses.find(course => course.code + course.name == code),
  );

  const [currentTab, setCurrentTab] = useState('overview');

  const tabs = [
    {
      name: 'overview',
      icon: 'apps',
    },
    {
      name: 'material',
      icon: 'file-outline',
    },
    {
      name: 'recordings',
      icon: 'video-outline',
    },
    {
      name: 'alerts',
      icon: 'bell-alert-outline',
    },
  ];

  // Populate course data if empty
  useEffect(() => {
    if (
      courseData &&
      courseData?.loadCourseStatus.code != STATUS.PENDING &&
      courseData?.loadCourseStatus.code != STATUS.SUCCESS
    ) {
      dispatch(loadCourse({courseData, device: deviceContext.device}));
    }
  }, []);

  return (
    <ScreenContainer style={{paddingHorizontal: 0}}>
      <View style={styles.withHorizontalPadding}>
        <ArrowHeader backFunc={navigation.goBack} />
      </View>
      {courseData?.loadCourseStatus.code == STATUS.SUCCESS &&
      courseData.academicYear ? (
        <View style={{flex: 1}}>
          <View style={styles.withHorizontalPadding}>
            <TextXL
              text={courseData.name}
              numberOfLines={2}
              weight="medium"
              color={colors.black}
            />
          </View>
          <View
            style={{
              ...styles.withHorizontalPadding,
              flexDirection: 'column',
            }}>
            <TextL text={courseData.code} color={colors.mediumGray} />
            <View style={{flexDirection: 'column', marginTop: 16}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                <Icon name="person-outline" color={colors.gray} size={16} />
                <TextS
                  style={{marginLeft: 4}}
                  text={
                    courseData.professor?.surname +
                    ' ' +
                    courseData.professor?.name
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                <IconC
                  name="star-four-points-outline"
                  color={colors.gray}
                  size={16}
                />
                <TextS style={{marginLeft: 4}} text={courseData.cfu + ' CFU'} />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                <IconC name="calendar" color={colors.gray} size={16} />
                <TextS
                  style={{marginLeft: 4}}
                  text={'A.A. ' + courseData.academicYear}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              marginVertical: 16,
              flexDirection: 'row',
              justifyContent: 'space-around',
              backgroundColor: colors.white,
              borderRadius: 16,
              ...styles.elevatedSmooth,
              marginHorizontal: styles.withHorizontalPadding.paddingHorizontal,
            }}>
            {tabs.map(tab => (
              <View
                key={tab.name}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <Pressable
                  android_ripple={{color: colors.lightGray}}
                  onPress={() => {
                    setCurrentTab(tab.name);
                  }}
                  style={{
                    width: '100%',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingVertical: 12,
                  }}>
                  <IconC
                    name={tab.icon}
                    size={24}
                    color={
                      tab.name == currentTab ? colors.gradient1 : colors.gray
                    }
                  />
                  <TextS
                    text={t(tab.name)}
                    color={
                      tab.name == currentTab ? colors.gradient1 : colors.gray
                    }
                  />
                </Pressable>
              </View>
            ))}
          </View>
          {(() => {
            switch (currentTab) {
              case 'overview':
                return (
                  <CourseOverview
                    courseData={courseData}
                    changeTab={setCurrentTab}
                  />
                );
              case 'material':
                return courseData.loadCourseStatus.code == STATUS.SUCCESS ? (
                  <ScrollView
                    contentContainerStyle={styles.withHorizontalPadding}>
                    <MaterialExplorer
                      course={courseData.code + courseData.name}
                    />
                  </ScrollView>
                ) : (
                  <RecentItemsLoader />
                );
              case 'alerts':
                return (
                  <View style={{...styles.withHorizontalPadding, flex: 1}}>
                    <CourseAlerts alerts={courseData.alerts} />
                  </View>
                );
              case 'recordings':
                return (
                  <View style={{...styles.withHorizontalPadding, flex: 1}}>
                    <CourseVideos
                      videos={courseData.recordings?.current}
                      courseData={{nome: courseData.name}}
                    />
                  </View>
                );
            }
          })()}
        </View>
      ) : (
        <CourseLoader />
      )}
    </ScreenContainer>
  );
}

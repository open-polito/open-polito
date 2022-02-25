import React, {useContext, useEffect, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, View} from 'react-native';
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
import {CourseState, loadCourse} from '../store/coursesSlice';
import {STATUS} from '../store/status';

export default function Course({navigation, route}) {
  const dispatch = useDispatch();

  const {t} = useTranslation();

  const deviceContext = useContext(DeviceContext);

  const code = route.params.courseCode;

  const courseData = useSelector<RootState, CourseState | undefined>(state =>
    state.courses.courses.find(
      course => course.basicInfo.code + course.basicInfo.name == code,
    ),
  );

  const [refreshing, setRefreshing] = useState(true);

  const refresh = () => {
    dispatch(
      loadCourse({
        basicCourseInfo: courseData!.basicInfo,
        device: deviceContext.device,
      }),
    );
  };

  const fields = [
    {
      name:
        courseData?.extendedInfo?.professor.surname +
        ' ' +
        courseData?.extendedInfo?.professor.name,
      icon: 'person-outline',
    },
    {
      name: courseData?.basicInfo.num_credits + ' CFU',
      icon: 'star-four-points-outline',
    },
    {
      name: 'A.A. ' + courseData?.extendedInfo?.calendar_year ?? '',
      icon: 'calendar',
    },
  ];

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
      courseData?.status.code != STATUS.PENDING &&
      courseData?.status.code != STATUS.SUCCESS
    ) {
      dispatch(
        loadCourse({
          basicCourseInfo: courseData.basicInfo,
          device: deviceContext.device,
        }),
      );
    }
  }, []);

  return (
    <ScreenContainer style={{paddingHorizontal: 0}}>
      <View style={styles.withHorizontalPadding}>
        <ArrowHeader backFunc={navigation.goBack} />
      </View>
      {courseData?.status.code == STATUS.SUCCESS && courseData.extendedInfo ? (
        <View style={{flex: 1}}>
          <View style={styles.withHorizontalPadding}>
            <TextXL
              text={courseData.basicInfo.name}
              numberOfLines={2}
              weight="bold"
              color={colors.black}
            />
          </View>
          <View
            style={{
              ...styles.withHorizontalPadding,
              flexDirection: 'column',
            }}>
            <TextL text={courseData.basicInfo.code} color={colors.mediumGray} />
            {fields.map(field => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingVertical: 2,
                }}>
                {field.icon == 'person-outline' ? (
                  <Icon name={field.icon} size={16} color={colors.gray} />
                ) : (
                  <IconC name={field.icon} size={16} color={colors.gray} />
                )}
                <TextS style={{marginLeft: 4}} text={field.name} />
              </View>
            ))}
          </View>
          <View
            style={{
              marginTop: 16,
              marginBottom: 8,
              flexDirection: 'row',
              justifyContent: 'space-around',
              backgroundColor: colors.white,
              ...styles.elevatedSmooth,
              ...styles.border,
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
                    refresh={() => {
                      refresh();
                    }}
                  />
                );
              case 'material':
                return courseData.status.code == STATUS.SUCCESS ? (
                  <ScrollView
                    refreshControl={
                      <RefreshControl refreshing={false} onRefresh={refresh} />
                    }
                    contentContainerStyle={styles.withHorizontalPadding}>
                    <MaterialExplorer
                      courseId={
                        courseData.basicInfo.code + courseData.basicInfo.name
                      }
                    />
                  </ScrollView>
                ) : (
                  <RecentItemsLoader />
                );
              case 'alerts':
                return (
                  <View
                    style={{
                      ...styles.withHorizontalPadding,
                      flex: 1,
                      paddingTop: 8,
                    }}>
                    <CourseAlerts
                      alerts={courseData.extendedInfo.notices}
                      refresh={refresh}
                    />
                  </View>
                );
              case 'recordings':
                return (
                  <View style={{...styles.withHorizontalPadding, flex: 1}}>
                    <CourseVideos
                      videos={courseData.extendedInfo.vc_recordings?.current}
                      courseData={courseData.basicInfo}
                      refresh={() => {
                        refresh;
                      }}
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

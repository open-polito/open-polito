import React, {FC, useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, View} from 'react-native';
import {useSelector} from 'react-redux';
import {DeviceContext} from '../context/Device';
import {CourseData} from '../store/coursesSlice';
import {RootState} from '../store/store';
import styles from '../styles';
import {getRecentCourseMaterial} from '../utils/material';
import AlertWidget from './widgets/AlertWidget';
import CourseInfo from './CourseInfo';
import CourseVideos from './CourseVideos';
import LiveWidget from './widgets/LiveWidget';
import MaterialWidget from './widgets/MaterialWidget';
import TextWidget from './TextWidget';
import {Cartella, File} from 'open-polito-api/corso';

const CourseOverview: FC<{courseData: CourseData; changeTab: Function}> = ({
  courseData,
  changeTab,
}) => {
  const {t} = useTranslation();

  const deviceContext = useContext(DeviceContext);

  const [offsetY, setOffsetY] = useState(0);

  const materialTree = useSelector<RootState, (File | Cartella)[] | undefined>(
    state =>
      state.courses.courses.find(
        course =>
          courseData.code + courseData.name == course.code + course.name,
      )?.material,
  );

  const [recentMaterialLength, setRecentMaterialLength] = useState(3);

  // Set length of recent material once tree is loaded
  useEffect(() => {
    materialTree &&
      setRecentMaterialLength(getRecentCourseMaterial(materialTree).length);
  }, [materialTree]);

  const [shouldAlignHeights, setShouldAlignHeights] = useState(false);

  // Once recent material length is computed, set whether to align widget heights
  useEffect(() => {
    setShouldAlignHeights(
      (courseData.alerts?.slice(0, 3).length || 0) == recentMaterialLength,
    );
  }, [recentMaterialLength]);

  return (
    <ScrollView
      onScroll={e => {
        setOffsetY(e.nativeEvent.contentOffset.y);
      }}
      contentContainerStyle={{
        ...styles.withHorizontalPadding,
        paddingBottom: offsetY == 0 ? 32 : 16,
      }}>
      {courseData.liveClasses?.map(liveClass => (
        <LiveWidget
          key={liveClass.meetingID}
          liveClass={liveClass}
          courseName={courseData.name}
          device={deviceContext.device}
        />
      )) || null}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
        <MaterialWidget
          fullHeight={shouldAlignHeights}
          courseID={courseData.code + courseData.name}
          action={() => {
            changeTab('material');
          }}
        />
        <AlertWidget
          fullHeight={shouldAlignHeights}
          alerts={courseData.alerts?.slice(0, 3) || []}
          action={() => {
            changeTab('alerts');
          }}
        />
      </View>
      <TextWidget icon="information-outline" name={t('courseInfo')} expandable>
        <CourseInfo data={courseData.info || []} />
      </TextWidget>
      {/* <TextWidget name={t('oldVideos')} expandable>
        <CourseVideos videos={courseData.videolezioni} />
      </TextWidget> */}
    </ScrollView>
  );
};

export default CourseOverview;

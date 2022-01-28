import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, View} from 'react-native';
import {useSelector} from 'react-redux';
import styles from '../styles';
import {getRecentCourseMaterial} from '../utils/material';
import AlertWidget from './AlertWidget';
import CourseInfo from './CourseInfo';
import CourseVideos from './CourseVideos';
import LiveWidget from './LiveWidget';
import MaterialWidget from './MaterialWidget';
import TextWidget from './TextWidget';

export default function CourseOverview({courseData, changeTab}) {
  const {t} = useTranslation();

  const [offsetY, setOffsetY] = useState(0);

  const materialTree = useSelector(state => state.material.material);

  const [recentMaterialLength, setRecentMaterialLength] = useState(3);

  // Set length of recent material once tree is loaded
  useEffect(() => {
    materialTree &&
      setRecentMaterialLength(
        getRecentCourseMaterial(
          materialTree[courseData.codice + courseData.nome],
        ).length,
      );
  }, [materialTree]);

  const [shouldAlignHeights, setShouldAlignHeights] = useState(false);

  // Once recent material length is computed, set whether to align widget heights
  useEffect(() => {
    setShouldAlignHeights(
      courseData.avvisi.slice(0, 3).length == recentMaterialLength,
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
      {courseData.live_lessons.map(liveClass => (
        <LiveWidget
          key={liveClass.meeting_id}
          liveClass={liveClass}
          courseName={courseData.nome}
          device={courseData.device}
        />
      ))}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
        <MaterialWidget
          fullHeight={shouldAlignHeights}
          courseCode={courseData.codice + courseData.nome}
          action={() => {
            changeTab('material');
          }}
        />
        <AlertWidget
          fullHeight={shouldAlignHeights}
          alerts={courseData.avvisi.slice(0, 3)}
          action={() => {
            changeTab('alerts');
          }}
        />
      </View>
      <TextWidget icon="information-outline" name={t('courseInfo')} expandable>
        <CourseInfo data={courseData.info} />
      </TextWidget>
      {/* <TextWidget name={t('oldVideos')} expandable>
        <CourseVideos videos={courseData.videolezioni} />
      </TextWidget> */}
    </ScrollView>
  );
}

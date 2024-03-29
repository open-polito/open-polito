import {useNavigation} from '@react-navigation/core';
import React, {ReactElement, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, View} from 'react-native';
import {useSelector} from 'react-redux';
import {p} from '../scaling';
import {CourseState} from '../store/coursesSlice';
import {RootState} from '../store/store';
import Filters from './Filters';
import NoContent from './NoContent';
import VideoCard from './VideoCard';

const CourseVideos = ({
  courseId,
  dark,
  refreshControl,
}: {
  courseId: string;
  dark: boolean;
  refreshControl: ReactElement;
}) => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  const [selectedYear, setSelectedYear] = useState('current');

  const courseData = useSelector<RootState, CourseState | undefined>(state =>
    state.courses.courses.find(
      course => course.basicInfo.code + course.basicInfo.name == courseId,
    ),
  );

  const videos = useMemo(() => {
    if (selectedYear === 'current') {
      return [...(courseData?.extendedInfo?.vc_recordings.current || [])].sort(
        (a, b) => b.date - a.date,
      );
    }
    return [
      ...(courseData?.extendedInfo?.vc_recordings[parseInt(selectedYear, 10)] ||
        []),
    ].sort((a, b) => b.date - a.date);
  }, [courseData, selectedYear]);

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={videos}
        ListEmptyComponent={<NoContent />}
        refreshControl={refreshControl}
        ListHeaderComponent={
          <CourseVideosHeader
            courseData={courseData}
            onYearChange={y => setSelectedYear(y)}
          />
        }
        renderItem={({item}) => (
          <VideoCard
            item={item}
            dark={dark}
            onPress={() => {
              navigation.navigate('Video', {
                video: item,
                courseId: courseId,
              });
            }}
          />
        )}
      />
    </View>
  );
};

const CourseVideosHeader = ({
  courseData,
  onYearChange,
}: {
  courseData: CourseState | undefined;
  onYearChange: (arg0: string) => any;
}) => {
  return (
    <View style={{marginLeft: 16 * p}}>
      <View style={{height: 16 * p}} />
      <Filters
        items={Object.keys(courseData?.extendedInfo?.vc_recordings || {})
          .sort((a, b) => (a < b ? 1 : -1))
          .map(key => ({label: key, value: key}))}
        onChange={y => onYearChange(y)}
      />
      <View style={{height: 8 * p}} />
    </View>
  );
};

export default CourseVideos;

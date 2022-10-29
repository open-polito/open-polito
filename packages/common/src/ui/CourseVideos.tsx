import {useNavigation} from '@react-navigation/core';
import moment from 'moment';
import {BasicCourseInfo, Recording} from 'open-polito-api/course';
import React, {ReactElement, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import colors from '../colors';
import {TextN, TextS} from '../components/Text';
import {p} from '../scaling';
import {CourseState} from '../store/coursesSlice';
import {RootState} from '../store/store';
import PressableBase from './core/PressableBase';
import TablerIcon from './core/TablerIcon';
import Text from './core/Text';
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
    <View>
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
                video: {
                  video: item,
                  courseId: courseId,
                }, // Directly convert Date to localized date string because react-navigation wants serialized data
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

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
import VideoCard from './VideoCard';

// TODO previous years videos

const CourseVideos = ({
  courseId,
  dark,
  refreshControl,
  year,
}: {
  courseId: string;
  dark: boolean;
  refreshControl: ReactElement;
  year: string; // Set to -1 to show current year's videos
}) => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  const width = Dimensions.get('window').width;

  const courseData = useSelector<RootState, CourseState | undefined>(state =>
    state.courses.courses.find(
      course => course.basicInfo.code + course.basicInfo.name == courseId,
    ),
  );

  const videos = useMemo(() => {
    return [...(courseData?.extendedInfo?.vc_recordings.current || [])].sort(
      (a, b) => b.date - a.date,
    );
  }, [courseData, year]);

  return (
    <View>
      <FlatList
        style={{
          paddingHorizontal: 16 * p,
        }}
        data={videos}
        ListEmptyComponent={
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TextN text={t('noVideos')} />
          </View>
        }
        refreshControl={refreshControl}
        ListHeaderComponent={() => <View style={{height: 24 * p}} />}
        renderItem={({item}) => (
          <VideoCard
            item={item}
            dark={dark}
            onPress={() => {
              navigation.navigate('VideoPlayer', {
                video: {
                  ...item,
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

export default CourseVideos;

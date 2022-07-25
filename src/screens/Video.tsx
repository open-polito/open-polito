import {useNavigation} from '@react-navigation/core';
import React, {useContext, useMemo, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import styles from '../styles';
import colors from '../colors';
import {TextL, TextN, TextS} from '../components/Text';
import {useTranslation} from 'react-i18next';
import RNVideoPlayer from 'react-native-video-controls';
import {Recording} from 'open-polito-api/course';
import {DeviceContext} from '../context/Device';
import {p} from '../scaling';
import Screen from '../ui/Screen';
import Text from '../ui/core/Text';
import Button from '../ui/core/Button';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {CourseState} from '../store/coursesSlice';
import Section from '../ui/Section';
import VideoCard from '../ui/VideoCard';
import moment from 'moment';
import VideoPlayer from '../ui/VideoPlayer';

// TODO fullscreen mode
// TODO custom video controls design
// TODO "cast to" feature
// TODO video download

export default function Video({route}) {
  const {t} = useTranslation();

  const video: {video: Recording; courseId: string} = route.params.video;

  const [currentVideo, setCurrentVideo] = useState<Recording>(video.video);

  const courseData = useSelector<RootState, CourseState | undefined>(state =>
    state.courses.courses.find(
      course => course.basicInfo.code + course.basicInfo.name == video.courseId,
    ),
  );

  const relatedVideos = useMemo(() => {
    return [...(courseData?.extendedInfo?.vc_recordings.current || [])].sort(
      (a, b) => b.date - a.date,
    );
  }, [currentVideo, courseData]);

  const {dark, device} = useContext(DeviceContext);

  const navigation = useNavigation();

  const w = Dimensions.get('window').width;

  const _styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        paddingHorizontal: 16 * p,
        paddingTop: 24 * p,
      },
    });
  }, [dark]);

  return (
    <Screen>
      <View
        style={{
          height: w / 1.78,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        {/* <RNVideoPlayer
          source={{uri: currentVideo.url}}
          navigator={navigation}
          seekColor={colors.gradient1}
        /> */}
        <VideoPlayer video={currentVideo} />
      </View>
      <FlatList
        data={relatedVideos}
        renderItem={({item}) => (
          <View
            style={[
              item.url == currentVideo.url
                ? {backgroundColor: dark ? colors.gray600 : colors.gray300}
                : {},
            ]}>
            <VideoCard
              item={item}
              dark={dark}
              onPress={() => setCurrentVideo(item)}
            />
          </View>
        )}
        keyExtractor={item => item.url}
        ListHeaderComponent={() => (
          <View style={_styles.container}>
            <Text s={16 * p} w="b" c={dark ? colors.gray100 : colors.gray800}>
              {currentVideo.title}
            </Text>
            <Text
              s={12 * p}
              w="m"
              c={dark ? colors.gray200 : colors.gray500}
              style={{marginTop: 8 * p}}>
              {courseData?.basicInfo.name} ·{' '}
              {moment(currentVideo.date).format('ll')}
            </Text>

            <View style={{marginVertical: 24 * p}}>
              {/* <Button text={t('download (feature coming soon)')} secondary /> */}
            </View>
            <Text s={12 * p} w="m" c={dark ? colors.gray100 : colors.gray800}>
              {t('relatedVideos')}
            </Text>
          </View>
        )}
      />
    </Screen>
  );
}

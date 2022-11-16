import React, {FC, useContext, useMemo, useState} from 'react';
import {FlatList, useWindowDimensions, View} from 'react-native';
import colors from '../colors';
import {useTranslation} from 'react-i18next';
import {Recording} from 'open-polito-api/lib/course';
import {DeviceContext} from '../context/Device';
import {p} from '../scaling';
import Screen from '../ui/Screen';
import Text from '../ui/core/Text';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {CourseState} from '../store/coursesSlice';
import VideoCard from '../ui/VideoCard';
import moment from 'moment';
import VideoPlayer from '../ui/VideoPlayer';
import Header, {HEADER_TYPE} from '../ui/Header';
import {DeviceSize} from '../types';
import {genericPlatform} from '../utils/platform';

// TODO custom video controls design
// TODO "cast to" feature
// TODO video download

interface VideoInfoProps {
  courseData?: CourseState;
  video: Recording;
  dark: boolean;
}

const VideoInfo: FC<VideoInfoProps> = ({courseData, video, dark}) => {
  return (
    <View>
      <Text s={16 * p} w="b" c={dark ? colors.gray100 : colors.gray800}>
        {video.title}
      </Text>
      <Text
        s={12 * p}
        w="m"
        c={dark ? colors.gray200 : colors.gray500}
        style={{marginTop: 8 * p}}>
        {courseData?.basicInfo.name} · {moment(video.date).format('ll')}
      </Text>

      <View style={{marginVertical: 24 * p}}>
        {/* <Button text={t('download (feature coming soon)')} secondary /> */}
      </View>
    </View>
  );
};

interface VideoPlayerWrapperProps {
  currentVideo: Recording;
  windowWidth?: number;
  windowHeight?: number;
}

const VideoPlayerWrapper: FC<VideoPlayerWrapperProps> = ({
  currentVideo,
  windowWidth,
  windowHeight,
}) => {
  return (
    <View
      style={[
        {width: '100%'},
        genericPlatform !== 'mobile' && {
          flex: 1,
        },
        !!windowWidth && {
          height: windowWidth / 1.78,
        },
        !!windowHeight && {
          maxHeight: windowHeight / 2,
        },
      ]}>
      <VideoPlayer video={currentVideo} />
    </View>
  );
};

interface RecommendedFlatListProps {
  currentVideo: Recording;
  relatedVideos: Recording[];
  dark: boolean;
  setCurrentVideo: (video: Recording) => any;
  courseData?: CourseState;
}

const RecommendedFlatList: FC<RecommendedFlatListProps> = ({
  currentVideo,
  relatedVideos,
  dark,
  setCurrentVideo,
  courseData,
}) => {
  const {t} = useTranslation();
  return (
    <FlatList
      data={relatedVideos}
      renderItem={({item}) => (
        <View
          style={[
            item.url === currentVideo.url
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
        <View
          style={{
            paddingHorizontal: 16 * p,
            paddingBottom: 16 * p,
          }}>
          {!!courseData && (
            <View style={{marginTop: 16 * p}}>
              <VideoInfo
                video={currentVideo}
                courseData={courseData}
                dark={dark}
              />
            </View>
          )}
          <Text s={12 * p} w="m" c={dark ? colors.gray100 : colors.gray800}>
            {t('relatedVideos')}
          </Text>
        </View>
      )}
    />
  );
};

export default function Video({route}) {
  const {video, courseId} = route.params;

  const [currentVideo, setCurrentVideo] = useState<Recording>(video);

  const courseData = useSelector<RootState, CourseState | undefined>(state =>
    state.courses.courses.find(
      course => course.basicInfo.code + course.basicInfo.name === courseId,
    ),
  );

  const relatedVideos = useMemo<Recording[]>(() => {
    return [...(courseData?.extendedInfo?.vc_recordings.current || [])].sort(
      (a, b) => b.date - a.date,
    );
  }, [courseData]);

  const {dark, size} = useContext(DeviceContext);

  const {width, height} = useWindowDimensions();

  const memoizedVideoPlayer = useMemo(
    () => (
      <VideoPlayerWrapper
        currentVideo={currentVideo}
        windowWidth={genericPlatform === 'mobile' ? width : undefined}
        windowHeight={
          size >= DeviceSize.lg && genericPlatform === 'mobile'
            ? height
            : undefined
        }
      />
    ),
    [currentVideo, height, size, width],
  );
  return (
    <Screen>
      <Header title={video.title} headerType={HEADER_TYPE.SECONDARY} />
      <View style={{flex: 1, overflow: 'scroll'}}>
        <View
          style={
            size >= DeviceSize.lg
              ? {
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  flex: 1,
                  paddingHorizontal: 64 * p,
                }
              : {
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  flex: 1,
                }
          }>
          <View
            style={
              size >= DeviceSize.lg
                ? {flex: 2}
                : genericPlatform === 'mobile' && {flex: 1}
            }>
            <View>{memoizedVideoPlayer}</View>
            <View
              style={
                size >= DeviceSize.lg ? {marginTop: 24 * p, flex: 1} : {flex: 1}
              }>
              {size >= DeviceSize.lg ? (
                <VideoInfo
                  courseData={courseData}
                  video={currentVideo}
                  dark={dark}
                />
              ) : (
                <View style={{flex: 1}}>
                  <RecommendedFlatList
                    courseData={courseData}
                    currentVideo={currentVideo}
                    relatedVideos={relatedVideos}
                    setCurrentVideo={setCurrentVideo}
                    dark={dark}
                  />
                </View>
              )}
            </View>
          </View>
          {size >= DeviceSize.lg && (
            <>
              <View style={{width: 32 * p}} />
              <View style={{flex: 1}}>
                <RecommendedFlatList
                  currentVideo={currentVideo}
                  relatedVideos={relatedVideos}
                  setCurrentVideo={setCurrentVideo}
                  dark={dark}
                />
              </View>
            </>
          )}
        </View>
      </View>
    </Screen>
  );
}

import {useNavigation} from '@react-navigation/core';
import moment from 'moment';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  View,
} from 'react-native';
import colors from '../colors';
import {TextN, TextS} from './Text';

export default function CourseVideos({videos: _videos, courseData, refresh}) {
  const {t} = useTranslation();

  const navigation = useNavigation();

  const width = Dimensions.get('window').width;

  const [videos] = useState(
    [..._videos].sort((a, b) => {
      return new Date(b.data) - new Date(a.data);
    }),
  );

  return (
    <View
      style={{
        flex: 1,
      }}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              refresh();
            }}
          />
        }
        data={videos}
        ListEmptyComponent={
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TextN text={t('noVideos')} />
          </View>
        }
        renderItem={({item}) => {
          return (
            <Pressable
              onPress={() => {
                navigation.navigate('VideoPlayer', {
                  video: {
                    ...item,
                    data: moment(item.data).format('lll'),
                    courseData: courseData,
                  }, // Directly convert Date to localized date string because react-navigation wants serialized data
                });
              }}
              android_ripple={{color: colors.lightGray}}
              key={item.titolo}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 8,
                height: width / 4,
              }}>
              <Image
                source={{
                  uri: item.cover_url.length != 0 ? item.cover_url : undefined,
                }}
                style={{width: width * 0.4, backgroundColor: '#000'}}
                resizeMode="contain"
              />
              <View
                style={{
                  marginLeft: 16,
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}>
                <TextN text={item.titolo} weight="medium" numberOfLines={2} />
                <TextS text={moment(item.data).format('lll')} />
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

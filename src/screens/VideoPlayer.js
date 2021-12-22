import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {Dimensions, View} from 'react-native';
import ArrowHeader from '../components/ArrowHeader';
import ScreenContainer from '../components/ScreenContainer';
import styles from '../styles';
import Video from 'react-native-video';
import colors from '../colors';
import {TextL, TextN} from '../components/Text';
import {useTranslation} from 'react-i18next';

export default function VideoPlayer({route}) {
  const {t} = useTranslation();

  const video = route.params.video;
  const courseData = route.params.video.courseData;

  const navigation = useNavigation();

  const w = Dimensions.get('window').width;

  return (
    <ScreenContainer style={{paddingHorizontal: 0}}>
      <View style={styles.withHorizontalPadding}>
        <ArrowHeader backFunc={navigation.goBack} text={t('videoPlayer')} />
      </View>
      <View
        style={{
          ...styles.paddingFromHeader,
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}>
        <View
          style={{
            flex: 2,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Video
            source={{uri: video.url}}
            style={{
              width: w,
              ...styles.elevatedSmooth,
              backgroundColor: colors.black,
            }}
            poster={video.cover_url}
            controls={true}
            resizeMode="contain"
            ignoreSilentSwitch="obey"
          />
        </View>
        <View
          style={{
            marginTop: 16,
            ...styles.withHorizontalPadding,
            flex: 3,
            flexDirection: 'column',
          }}>
          <TextL
            style={{marginBottom: 8}}
            numberOfLines={3}
            text={video.titolo}
            weight="bold"
          />
          <TextN text={video.data} />
          <TextN text={courseData.nome} />
        </View>
      </View>
    </ScreenContainer>
  );
}

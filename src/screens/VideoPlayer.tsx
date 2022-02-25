import {useNavigation} from '@react-navigation/core';
import React, {useState} from 'react';
import {Dimensions, Pressable, View} from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import styles from '../styles';
import colors from '../colors';
import {TextL, TextN, TextS} from '../components/Text';
import {useTranslation} from 'react-i18next';
import RNVideoPlayer from 'react-native-video-controls';
import {Recording} from 'open-polito-api/course';

export default function VideoPlayer({route}) {
  const {t} = useTranslation();

  const video: Recording = route.params.video;
  const courseData = route.params.video.courseData;

  const navigation = useNavigation();

  const w = Dimensions.get('window').width;

  const [selectedTab, setSelectedTab] = useState('sameCourse');

  // TODO enable in next release
  // const tabs = [
  //   {
  //     id: 'sameCourse',
  //     name: 'Ultimi in ' + courseData.nome,
  //   },
  //   {
  //     id: 'latest',
  //     name: 'Ultimi video',
  //   },
  // ];

  // const tabs = [];

  return (
    <ScreenContainer style={{paddingHorizontal: 0}} barStyle="dark-content">
      {/* <View style={styles.withHorizontalPadding}>
        <ArrowHeader backFunc={navigation.goBack} text={t('videoPlayer')} />
      </View> */}
      <View
        style={{
          // ...styles.paddingFromHeader,
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <RNVideoPlayer
            source={{uri: video.url}}
            navigator={navigation}
            seekColor={colors.gradient1}
          />
        </View>
        <View
          style={{
            marginTop: 16,
            ...styles.withHorizontalPadding,
            flex: 2,
            flexDirection: 'column',
          }}>
          <TextL
            style={{marginBottom: 8}}
            numberOfLines={3}
            text={video.title}
            weight="bold"
          />
          <TextN text={video.date} />
          <TextN text={courseData.nome} />
          <View
            style={{
              marginTop: 16,
              flexDirection: 'row',
              justifyContent: 'center',
              backgroundColor: colors.lightGray,
              borderRadius: 16,
            }}>
            {/* {tabs.map(tab => (
              <Pressable
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  backgroundColor:
                    selectedTab == tab.id ? colors.gradient1 : colors.lightGray,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 16,
                }}
                android_ripple={{color: colors.lightGray}}
                onPress={() => {
                  setSelectedTab(tab.id);
                }}>
                <TextS
                  key={tab.id}
                  text={tab.name}
                  color={selectedTab == tab.id ? colors.white : colors.black}
                />
              </Pressable>
            ))} */}
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

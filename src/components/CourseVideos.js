import moment from 'moment';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, FlatList, Image, View} from 'react-native';
import {TextN, TextS} from './Text';

export default function CourseVideos({videos}) {
  const {t} = useTranslation();

  const width = Dimensions.get('window').width;

  return (
    <View
      style={{
        flex: 1,
      }}>
      <FlatList
        data={videos}
        ListEmptyComponent={
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TextN text={t('noVideos')} />
          </View>
        }
        renderItem={({item}) => {
          return (
            <View
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
            </View>
          );
        }}
      />
    </View>
  );
}

import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {Recording} from 'open-polito-api/lib/course';
import React, {useMemo, useState} from 'react';
import {Dimensions, Image, View} from 'react-native';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import colors from '../colors';
import {p} from '../scaling';
import PressableBase from './core/PressableBase';
import Text from './core/Text';

const VideoCard = ({
  item,
  onPress,
  dark,
}: {
  item: Recording;
  onPress: () => any;
  dark: boolean;
}) => {
  const [width, setWidth] = useState<number>(0);

  const hours = useMemo(() => item.length / 60, [item.length]);

  const minsString = useMemo(() => {
    let res = Math.ceil((hours - Math.floor(hours)) * 60).toString();
    if (res.length === 1) {
      res = '0' + res;
    }
    return res;
  }, [hours]);

  /**
   * Only show element when image width has been computed
   */
  const animStyle = useAnimatedStyle(() => ({
    opacity: withTiming(width === 0 ? 0 : 1, {duration: 200}),
  }));

  const lengthString = Math.floor(hours) + ':' + minsString + ':00';
  return (
    <Animated.View style={[animStyle]}>
      <PressableBase
        onLayout={e => setWidth(e.nativeEvent.layout.width)}
        onPress={onPress}
        android_ripple={{color: colors.lightGray}}
        key={item.date + item.title}
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 12 * p,
            paddingHorizontal: 16 * p,
          },
        ]}>
        <View
          style={{
            width: width * 0.4,
            height: width * 0.23,
          }}>
          <Image
            source={{
              uri: item.cover_url.length !== 0 ? item.cover_url : undefined,
            }}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#000',
            }}
            resizeMode="contain"
          />
          <View
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              padding: 4 * p,
              backgroundColor: '#000',
            }}>
            <Text s={10 * p} w="m" c={colors.gray100}>
              {lengthString}
            </Text>
          </View>
        </View>
        <View
          style={{
            marginLeft: 16 * p,
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
          <View>
            <Text
              w="m"
              s={12 * p}
              c={dark ? colors.gray100 : colors.gray800}
              numberOfLines={2}>
              {item.title}
            </Text>
            <Text
              w="r"
              s={10 * p}
              c={dark ? colors.gray200 : colors.gray700}
              numberOfLines={1}
              style={{marginVertical: 8 * p}}>
              {moment(item.date).format('ll')}
            </Text>
          </View>
          {/* TODO video downloader */}
          {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TablerIcon
                  name="download"
                  size={16 * p}
                  color={colors.accent300}
                  style={{marginRight: 4 * p}}
                />
                <Text
                  w="r"
                  s={10 * p}
                  c={dark ? colors.gray200 : colors.gray700}
                  numberOfLines={1}>
                  {item.url}
                </Text>
              </View> */}
        </View>
      </PressableBase>
    </Animated.View>
  );
};

export default VideoCard;

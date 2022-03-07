import moment from 'moment';
import {Notification} from 'open-polito-api/notifications';
import React from 'react';
import {Pressable, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {RenderHTMLSource} from 'react-native-render-html';
import colors from '../colors';
import styles from '../styles';
import {TextS} from './Text';

const NotificationComponent = ({
  notification,
  handlePress,
}: {
  notification: Notification;
  handlePress: (id: number) => void;
}) => {
  const offset = useSharedValue(0);

  const animStyles = useAnimatedStyle(() => {
    return {
      width: notification.is_read
        ? withTiming(0, {duration: 500})
        : withTiming(12 - offset.value, {duration: 500}),
      height: notification.is_read
        ? withTiming(0, {duration: 500})
        : withTiming(12 - offset.value, {duration: 500}),
      marginRight: notification.is_read
        ? withTiming(0, {duration: 500})
        : withTiming(6, {duration: 500}),
    };
  });

  return (
    <Pressable
      onPress={() => {
        if (!notification.is_read) offset.value = 12;
        handlePress(notification.id);
      }}
      android_ripple={{color: colors.lightGray}}
      style={{
        marginHorizontal: styles.withHorizontalPadding.paddingHorizontal,
        ...styles.elevatedSmooth,
        ...styles.border,
        paddingHorizontal: 8,
        paddingVertical: 8,
        marginBottom: 16,
        backgroundColor: colors.white,
      }}>
      <Animated.View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Animated.View
          style={[
            animStyles,
            {
              backgroundColor: colors.red,
              borderRadius: 12,
            },
          ]}
        />
        <TextS text={moment(notification.time).format('lll')} />
      </Animated.View>
      <View
        style={{
          flexDirection: 'row',
          overflow: 'hidden',
          marginTop: 4,
        }}>
        <TextS text={notification.title} weight="bold" />
      </View>
      {notification.body ? (
        <RenderHTMLSource source={{html: notification.body}} />
      ) : null}
    </Pressable>
  );
};

export default NotificationComponent;

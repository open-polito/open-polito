import {decode} from 'html-entities';
import moment from 'moment';
import {Notification} from 'open-polito-api/notifications';
import {NotificationType} from 'open-polito-api/notifications';
import React, {FC, useEffect, useMemo} from 'react';
import {View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {RenderHTMLSource} from 'react-native-render-html';
import colors from '../colors';
import {p} from '../scaling';
import {ExtendedAlert} from '../types';
import TablerIcon from './core/TablerIcon';
import Text from './core/Text';

export type NotificationParams = {
  type: NotificationType | string;
  notification: ExtendedAlert | Notification; // TODO add support for generic notifications (Notification type in API code)
  dark: boolean;
  read?: boolean;
  courseName?: string;
};

const isCourseAlert = (n: ExtendedAlert | Notification): n is ExtendedAlert => {
  return (n as Notification).topic === undefined;
};
const NotificationComponent: FC<NotificationParams> = ({
  type,
  notification,
  dark,
  read = true,
  courseName = '',
}) => {
  const htmlTags = /[<][/]?[^/>]+[/]?[>]+/g;

  const icon = useMemo(() => {
    switch (type) {
      case NotificationType.TEST:
        return 'test-pipe';
      case NotificationType.DIRECT:
        return 'message-dots';
      case NotificationType.NOTICE:
        return 'bell';
      case NotificationType.MATERIAL:
        return 'files';
      default:
        return 'bell';
    }
  }, [type]);

  const text = useMemo(() => {
    return decode(
      (isCourseAlert(notification)
        ? notification.text
        : notification.body || ''
      )
        .replace('\n', ' \n')
        .replace(htmlTags, '')
        .trim(),
    );
  }, [notification]);

  const dateString = useMemo(() => {
    return moment(
      isCourseAlert(notification) ? notification.date : notification.time,
    ).format('ll');
  }, [notification]);

  const offset = useSharedValue(read ? 0 : 1);

  const animStyle = useAnimatedStyle(() => ({
    width: 8 * p * offset.value,
    height: 8 * p * offset.value,
    backgroundColor: colors.red,
    borderRadius: 8 * p,
    marginRight: 8 * p * offset.value,
  }));

  /**
   * If read, hide red badge
   */
  useEffect(() => {
    if (!read) return;
    offset.value = withTiming(0, {duration: 500});
  }, [read]);

  return (
    <View style={{flexDirection: 'column'}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Animated.View style={[animStyle]}></Animated.View>
        <View
          style={{
            width: 32 * p,
            height: 32 * p,
            borderRadius: 4 * p,
            backgroundColor: dark ? colors.gray700 : colors.gray200,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16 * p,
          }}>
          <TablerIcon name={icon} color={colors.accent300} size={16 * p} />
        </View>
        <View style={{flexDirection: 'column'}}>
          <Text
            s={12 * p}
            c={dark ? colors.gray100 : colors.gray800}
            w="r"
            numberOfLines={isCourseAlert(notification) ? 1 : 2}>
            {isCourseAlert(notification) ? text : notification.title}
          </Text>
          <Text
            s={10 * p}
            c={dark ? colors.gray200 : colors.gray700}
            w="r"
            numberOfLines={2}>
            {dateString}
            {isCourseAlert(notification)
              ? notification.course_name && ' · ' + notification.course_name
              : courseName && ' · ' + courseName}
          </Text>
        </View>
      </View>
      {text !== '' && (
        <View
          style={{
            marginTop: 12 * p,
            padding: 16 * p,
            borderRadius: 4 * p,
            backgroundColor: dark ? colors.gray700 : colors.gray200,
          }}>
          <RenderHTMLSource
            source={{
              html: text,
            }}
          />
        </View>
      )}
    </View>
  );
};

export default NotificationComponent;

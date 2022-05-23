import {decode} from 'html-entities';
import moment from 'moment';
import {Notice} from 'open-polito-api/course';
import {NotificationType} from 'open-polito-api/notifications';
import React, {FC, useMemo} from 'react';
import {View} from 'react-native';
import {RenderHTMLSource} from 'react-native-render-html';
import colors from '../colors';
import {p} from '../scaling';
import {ExtendedAlert} from '../types';
import TablerIcon from './core/TablerIcon';
import Text from './core/Text';

export type NotificationParams = {
  type: NotificationType;
  notification: ExtendedAlert; // TODO add support for generic notifications (Notification type in API code)
  dark: boolean;
};

const Notification: FC<NotificationParams> = ({type, notification, dark}) => {
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
      notification.text.replace('\n', ' \n').replace(htmlTags, '').trim(),
    );
  }, [notification]);

  const dateString = useMemo(() => {
    return moment(notification.date).format('ll');
  }, [notification]);

  return (
    <View style={{flexDirection: 'column'}}>
      <View style={{flexDirection: 'row'}}>
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
            numberOfLines={1}>
            {text}
          </Text>
          <Text
            s={10 * p}
            c={dark ? colors.gray200 : colors.gray700}
            w="r"
            numberOfLines={1}>
            {dateString}
            {notification.course_name ? ' · ' + notification.course_name : ''}
          </Text>
        </View>
      </View>
      <View
        style={{
          marginTop: 12 * p,
          padding: 16 * p,
          borderRadius: 4 * p,
          backgroundColor: dark ? colors.gray700 : colors.gray200,
        }}>
        <RenderHTMLSource source={{html: notification.text}} />
      </View>
    </View>
  );
};

export default Notification;

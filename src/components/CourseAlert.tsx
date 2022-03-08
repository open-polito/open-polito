import {decode} from 'html-entities';
import moment from 'moment';
import {Notice} from 'open-polito-api/course';
import React from 'react';
import {View} from 'react-native';
import {RenderHTMLSource} from 'react-native-render-html';
import colors from '../colors';
import NotificationComponent from './NotificationComponent';
import {TextS, TextXS} from './Text';

export type CourseAlertProps = {
  alert: Notice;
  compact?: boolean;
};

const CourseAlert = ({alert, compact = false}: CourseAlertProps) => {
  const htmlTags = /[<][/]?[^/>]+[/]?[>]+/g;

  return compact ? (
    <View
      style={{
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: compact ? 'center' : 'flex-start',
        width: '100%',
        borderBottomWidth: compact ? 0 : 2,
        borderBottomColor: colors.lightGray,
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.gradient1,
          flexDirection: 'column',
          paddingVertical: 4,
          paddingHorizontal: 6,
          borderRadius: 4,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: compact ? 4 : 8,
        }}>
        <TextXS text={moment(alert.date).format('MMM')} color={colors.white} />
        <TextXS text={moment(alert.date).format('DD')} color={colors.white} />
      </View>
      <View
        style={{
          flex: compact ? 5 : 11,
        }}>
        {compact ? (
          <TextS
            numberOfLines={2}
            text={decode(alert.text.replace(htmlTags, '')).trim()}
          />
        ) : (
          <RenderHTMLSource source={{html: alert.text}} />
        )}
      </View>
    </View>
  ) : (
    <View style={{flex: 1}}>
      <NotificationComponent
        date={moment(alert.date).format('ll')}
        title={null}
        body={
          compact ? decode(alert.text.replace(htmlTags, '')).trim() : alert.text
        }
        compact={compact}
        read={true}
        handlePress={() => {}}
      />
    </View>
  );
};

export default CourseAlert;

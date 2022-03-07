import {decode} from 'html-entities';
import moment from 'moment';
import {Notice} from 'open-polito-api/course';
import React from 'react';
import {View} from 'react-native';
import NotificationComponent from './NotificationComponent';

export type CourseAlertProps = {
  alert: Notice;
  compact?: boolean;
};

const CourseAlert = ({alert, compact = false}: CourseAlertProps) => {
  const htmlTags = /[<][/]?[^/>]+[/]?[>]+/g;

  return (
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

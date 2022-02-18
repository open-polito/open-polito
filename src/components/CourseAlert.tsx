import {decode} from 'html-entities';
import moment from 'moment';
import {Avviso} from 'open-polito-api/corso';
import React from 'react';
import {View} from 'react-native';
import RenderHTML from 'react-native-render-html';
import colors from '../colors';
import {TextS, TextXS} from './Text';

export type CourseAlertProps = {
  alert: Avviso;
  compact?: boolean;
};

const CourseAlert = ({alert, compact = false}: CourseAlertProps) => {
  const htmlTags = /[<][/]?[^/>]+[/]?[>]+/g;

  return (
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
        <TextXS text={moment(alert.data).format('MMM')} color={colors.white} />
        <TextXS text={moment(alert.data).format('DD')} color={colors.white} />
      </View>
      <View
        style={{
          flex: compact ? 5 : 11,
        }}>
        {compact ? (
          <TextS
            numberOfLines={2}
            text={decode(alert.info.replace(htmlTags, '')).trim()}
          />
        ) : (
          <RenderHTML
            source={{html: alert.info}}
            tagsStyles={{
              body: {
                color: colors.black,
              },
              p: {
                marginTop: 0,
              },
            }}
          />
        )}
      </View>
    </View>
  );
};

export default CourseAlert;

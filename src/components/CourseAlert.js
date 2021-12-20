import {decode} from 'html-entities';
import moment from 'moment';
import React from 'react';
import {View} from 'react-native';
import RenderHTML from 'react-native-render-html';
import colors from '../colors';
import {TextS} from './Text';

export default function CourseAlert({alert, compact = false}) {
  const htmlTags = /[</]+[a-zA-Z ]+[/>]+/g;

  return (
    <View
      style={{
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: compact ? 'center' : 'flex-start',
        width: '100%',
        borderBottomWidth: compact ? 0 : 4,
        borderBottomColor: colors.lightGray,
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.gradient1,
          flexDirection: 'column',
          padding: 2,
          borderRadius: 4,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: compact ? 4 : 8,
        }}>
        <TextS text={moment(alert.data).format('MMM')} color={colors.white} />
        <TextS text={moment(alert.data).format('DD')} color={colors.white} />
      </View>
      <View
        style={{
          flex: compact ? 4 : 7,
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
}

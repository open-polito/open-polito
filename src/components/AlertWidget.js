import {decode} from 'html-entities';
import moment from 'moment';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import colors from '../colors';
import {TextS} from './Text';
import WidgetBase from './WidgetBase';

export default function AlertWidget({action, alerts}) {
  const {t} = useTranslation();

  const htmlTags = /[</]+[a-zA-Z]+[>]/g;

  return (
    <WidgetBase name={t('alerts')} action={action}>
      {alerts ? (
        <View style={{flexDirection: 'column', marginTop: 8}}>
          {alerts.map(alert => (
            <View
              key={alert.data.toString() + alert.info.slice(0, 30)}
              style={{
                marginBottom: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
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
                  marginRight: 4,
                }}>
                <TextS
                  text={moment(alert.data).format('MMM')}
                  color={colors.white}
                />
                <TextS
                  text={moment(alert.data).format('DD')}
                  color={colors.white}
                />
              </View>
              <View
                style={{
                  flex: 4,
                }}>
                <TextS
                  numberOfLines={2}
                  text={decode(alert.info.replace(htmlTags, '')).trim()}
                />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <TextS text={t('loading')} />
      )}
    </WidgetBase>
  );
}

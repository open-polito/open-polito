import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import CourseAlert from './CourseAlert';
import {TextS} from './Text';
import WidgetBase from './WidgetBase';

export default function AlertWidget({action, alerts}) {
  const {t} = useTranslation();

  return (
    <WidgetBase name={t('alerts')} action={action}>
      {alerts ? (
        <View style={{flexDirection: 'column', marginTop: 8}}>
          {alerts.map(alert => (
            <CourseAlert
              compact
              alert={alert}
              key={alert.data.toString() + alert.info.slice(0, 30)}
            />
          ))}
        </View>
      ) : (
        <TextS text={t('loading')} />
      )}
    </WidgetBase>
  );
}

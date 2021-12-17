import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {TextN} from './Text';

export default function CourseInfo({data}) {
  const {t} = useTranslation();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TextN text={t('notImplementedFlashMessageDesc')} />
    </View>
  );
}

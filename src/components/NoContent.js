import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {TextN} from './Text';

export default function NoContent() {
  const {t} = useTranslation();

  return (
    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
      <TextN text={t('noContent')} />
    </View>
  );
}

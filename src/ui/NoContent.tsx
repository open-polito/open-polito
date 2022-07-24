import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import colors from '../colors';
import {DeviceContext} from '../context/Device';
import Text from './core/Text';

export default function NoContent() {
  const {t} = useTranslation();

  const {dark} = useContext(DeviceContext);

  return (
    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
      <Text s={12} w="m" c={dark ? colors.gray200 : colors.gray700}>
        {t('noContent')}
      </Text>
    </View>
  );
}

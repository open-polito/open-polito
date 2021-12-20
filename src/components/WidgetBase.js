import React from 'react';
import {Pressable, View} from 'react-native';
import colors from '../colors';
import styles from '../styles';
import {TextN, TextS} from './Text';
import {useTranslation} from 'react-i18next';

export default function WidgetBase({name, action, children}) {
  const {t} = useTranslation();

  return (
    <View
      style={{
        ...styles.elevatedSmooth,
        backgroundColor: colors.white,
        borderRadius: 16,
        width: '48%',
      }}>
      <Pressable
        style={{paddingHorizontal: 12, paddingVertical: 8}}
        android_ripple={{color: colors.lightGray}}
        onPress={action}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}>
          <TextN text={name} weight="medium" />
          {children}
          <View
            style={{
              backgroundColor: colors.lightGray,
              padding: 8,
              borderRadius: 8,
              marginVertical: 4,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <TextS text={t('open')} color={colors.black} weight="medium" />
          </View>
        </View>
      </Pressable>
    </View>
  );
}

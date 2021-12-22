import React from 'react';
import {Pressable, View} from 'react-native';
import colors from '../colors';
import styles from '../styles';
import {TextN, TextS} from './Text';
import {useTranslation} from 'react-i18next';

export default function WidgetBase({
  name,
  action = () => {},
  children,
  compact = false,
  withButton = true,
  withPadding = true,
}) {
  const {t} = useTranslation();

  return (
    <View
      style={{
        ...styles.elevatedSmooth,
        backgroundColor: colors.white,
        borderRadius: 16,
        width: compact ? '48%' : '100%',
        marginBottom: styles.withHorizontalPadding.paddingHorizontal / 2,
      }}>
      <Pressable
        style={{
          paddingHorizontal: withPadding ? 12 : 0,
          paddingVertical: withPadding ? 8 : 0,
        }}
        android_ripple={{color: colors.lightGray}}
        onPress={action}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}>
          {name && <TextN text={name} weight="medium" />}
          {children}

          {withButton && (
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
          )}
        </View>
      </Pressable>
    </View>
  );
}

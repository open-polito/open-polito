import React, {FC} from 'react';
import {Pressable, View, ViewStyle} from 'react-native';
import colors from '../../colors';
import styles from '../../styles';
import {TextN, TextS} from '../Text';
import {useTranslation} from 'react-i18next';

export type WidgetBaseProps = {
  name?: string;
  action?: Function;
  compact?: boolean;
  withButton?: boolean;
  withPadding?: boolean;
  fullHeight?: boolean;
  style?: ViewStyle;
};

const WidgetBase: FC<WidgetBaseProps> = ({
  name = '',
  action = () => {},
  compact = false,
  withButton = true,
  withPadding = true,
  fullHeight = false,
  children,
  style,
}) => {
  const {t} = useTranslation();

  return (
    <View
      style={{
        ...styles.elevatedSmooth,
        ...styles.border,
        backgroundColor: colors.white,
        width: compact ? '48%' : '100%',
        flex: 0,
        ...style,
      }}>
      <Pressable
        style={{
          paddingHorizontal: withPadding ? 12 : 0,
          paddingVertical: withPadding ? 8 : 0,
          flex: fullHeight ? 1 : 0,
        }}
        android_ripple={{color: colors.lightGray}}
        onPress={() => {
          action();
        }}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flex: 1,
          }}>
          {name ? <TextN text={name} weight="medium" /> : null}
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
};

export default WidgetBase;

import React, {FC, ReactNode} from 'react';
import {Pressable, View, ViewStyle} from 'react-native';
import colors from '../../colors';
import styles from '../../styles';
import {useTranslation} from 'react-i18next';
import Text from '../../ui/core/Text';
import {p} from '../../scaling';

export type WidgetBaseProps = {
  name?: string;
  action?: Function;
  compact?: boolean;
  withButton?: boolean;
  withPadding?: boolean;
  fullHeight?: boolean;
  style?: ViewStyle;
  dark?: boolean;
  children: ReactNode;
};

const WidgetBase: FC<WidgetBaseProps> = ({
  name = '',
  action = () => {},
  compact = false,
  withButton = true,
  withPadding = true,
  fullHeight = false,
  children,
  dark,
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
          {name ? (
            <Text w="m" s={12 * p} c={dark ? colors.gray100 : colors.gray800}>
              {name}
            </Text>
          ) : null}
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
              <Text w="m" s={10 * p} c={dark ? colors.gray100 : colors.gray800}>
                {t('open')}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
};

export default WidgetBase;

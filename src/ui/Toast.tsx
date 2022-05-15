import React, {FC, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import colors from '../colors';
import {p} from '../scaling';
import TablerIcon from './core/TablerIcon';
import Text from './core/Text';

// TODO "x" to dismiss and swipe to dismiss
// This is only the component, not the context provider I'll later use in the app

export type ToastParams = {
  visible: boolean;
  type: 'success' | 'warn' | 'err' | 'info';
  dark: boolean;
  text: string;
  icon?: string; // Overrides default provided icons
};

const types = {
  success: ['circle-check', colors.green],
  warn: ['alert-triangle', colors.orange],
  err: ['circle-x', colors.red],
  info: ['info-circle', colors.accent300],
};

const Toast: FC<ToastParams> = ({visible, type, dark, text, icon = ''}) => {
  const _styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        borderWidth: 1 * p,
        borderColor: types[type][1],
        borderRadius: 4 * p,
        backgroundColor: dark ? colors.gray700 : colors.gray200,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16 * p,
        marginTop: 16 * p,
        padding: 12 * p,
      },
    });
  }, []);
  return visible ? (
    <View style={_styles.container}>
      <TablerIcon
        name={icon ? icon : types[type][0]}
        color={types[type][1]}
        size={18 * p}
        style={{marginRight: 12 * p}}
      />
      <Text s={12 * p} w="m" c={colors.gray100}>
        {text}
      </Text>
    </View>
  ) : null;
};

export default Toast;

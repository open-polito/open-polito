import React, {FC, useMemo} from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import colors, {Color} from '../../colors';
import {p} from '../../scaling';
import PressableBase from './PressableBase';
import TablerIcon from './TablerIcon';
import Text from './Text';

type ButtonParams = {
  text: string;
  icon?: string;
  secondary?: boolean;
  color?: Color;
  loading?: boolean;
  style?: ViewStyle;
  small?: boolean;
} & PressableProps;

const Button: FC<ButtonParams> = ({
  text,
  icon = '',
  secondary = false,
  color = '',
  loading = false,
  style = {},
  small = false,
  ...props
}) => {
  const _styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flexDirection: 'row',
        backgroundColor: color || colors.accent300,
        borderColor: secondary ? color || colors.accent300 : 'rgba(0,0,0,0)',
        borderWidth: secondary ? 1 * p : 0,
        justifyContent: 'center',
        alignItems: 'center',
        height: (small ? 30 : 40) * p,
        paddingHorizontal: (small ? 6 : 12) * p,
        // paddingVertical: 12 * p,
        borderRadius: 4 * p,
      },
      containerSecondary: {
        backgroundColor: 'rgba(0,0,0,0)',
      },
    });
  }, []);

  return (
    <PressableBase>
      <Pressable {...props}>
        <View
          style={{
            ..._styles.container,
            ...(secondary ? _styles.containerSecondary : {}),
            ...(style as Object),
          }}>
          {loading ? (
            <ActivityIndicator
              size={(small ? 10 : 18) * p}
              color={color || (secondary ? colors.accent300 : colors.gray50)}
              style={{marginRight: (small ? 4 : 8) * p}}
            />
          ) : icon ? (
            <TablerIcon
              name={icon}
              color={color || (secondary ? colors.accent300 : colors.gray50)}
              size={(small ? 14 : 18) * p}
              style={{marginRight: (small ? 4 : 8) * p}}
            />
          ) : null}
          <Text
            s={small ? 10 : 12}
            w="m"
            c={secondary ? color || colors.accent300 : colors.gray50}>
            {text.toUpperCase()}
          </Text>
        </View>
      </Pressable>
    </PressableBase>
  );
};

export default Button;

import React, {FC, useMemo} from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import colors from '../../colors';
import {p} from '../../scaling';
import PressableBase from './PressableBase';
import TablerIcon from './TablerIcon';
import Text from './Text';

type ButtonParams = {
  text: string;
  icon?: string;
  secondary?: boolean;
  loading?: boolean;
  style?: ViewStyle;
} & PressableProps;

const Button: FC<ButtonParams> = ({
  text,
  icon = '',
  secondary = false,
  loading = false,
  style = {},
  ...props
}) => {
  const _styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flexDirection: 'row',
        backgroundColor: secondary ? 'rgba(0,0,0,0)' : colors.accent300,
        borderColor: secondary ? colors.accent300 : 'rgba(0,0,0,0)',
        borderWidth: secondary ? 1 * p : 0,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40 * p,
        paddingHorizontal: 12 * p,
        // paddingVertical: 12 * p,
        borderRadius: 4 * p,
      },
    });
  }, []);

  return (
    <PressableBase>
      <Pressable {...props}>
        <View style={{..._styles.container, ...(style as Object)}}>
          {loading ? (
            <ActivityIndicator
              size={18 * p}
              color={secondary ? colors.accent300 : colors.gray100}
              style={{marginRight: 8 * p}}
            />
          ) : icon ? (
            <TablerIcon
              name={icon}
              color={secondary ? colors.accent300 : colors.gray100}
              size={18 * p}
              style={{marginRight: 8 * p}}
            />
          ) : null}
          <Text s={12} w="m" c={secondary ? colors.accent300 : colors.gray100}>
            {text.toUpperCase()}
          </Text>
        </View>
      </Pressable>
    </PressableBase>
  );
};

export default Button;

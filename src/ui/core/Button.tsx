import React, {FC, useMemo} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import colors from '../../colors';
import PressableBase from './PressableBase';
import TablerIcon from './TablerIcon';
import Text from './Text';

type ButtonParams = {
  text: string;
  icon?: string;
  secondary?: boolean;
  style?: ViewStyle;
};

const Button: FC<ButtonParams> = ({
  text,
  icon = '',
  secondary = false,
  style = {},
}) => {
  const _styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flexDirection: 'row',
        backgroundColor: secondary ? 'rgba(0,0,0,0)' : colors.accent300,
        borderColor: secondary ? colors.accent300 : 'rgba(0,0,0,0)',
        borderWidth: secondary ? 2 : 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 4,
      },
    });
  }, []);

  return (
    <PressableBase>
      <View style={{..._styles.container, ...style}}>
        {icon ? (
          <TablerIcon
            name={icon}
            color={secondary ? colors.accent300 : colors.gray100}
            size={18}
            style={{marginRight: 8}}
          />
        ) : null}
        <Text s={12} w="m" c={secondary ? colors.accent300 : colors.gray100}>
          {text.toUpperCase()}
        </Text>
      </View>
    </PressableBase>
  );
};

export default Button;

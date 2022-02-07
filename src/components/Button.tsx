import React, {FC} from 'react';
import {View, Pressable, StyleSheet, ViewStyle} from 'react-native';
import colors, {Color} from '../colors';
import {TextN} from './Text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Button: FC<{
  text: string;
  onPress: Function;
  backgroundColor?: Color;
  color?: Color;
  style?: ViewStyle;
  icon?: string;
}> = ({
  text,
  onPress,
  backgroundColor = colors.gradient1,
  color = colors.white,
  style = {},
  icon = null,
}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      <Pressable
        style={{..._styles.btn, backgroundColor, ...style}}
        android_ripple={{color: '#eee'}}
        onPress={() => {
          onPress();
        }}>
        {icon && <Icon name={icon} size={24} color={color} />}
        <TextN
          text={text}
          weight="medium"
          color="white"
          style={{color, marginLeft: 4}}
        />
      </Pressable>
    </View>
  );
};

const _styles = StyleSheet.create({
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gradient1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
});

export default Button;

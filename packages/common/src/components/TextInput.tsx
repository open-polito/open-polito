import React, {FC} from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles';
import colors, {Color} from '../colors';

export type TextInputProps = RNTextInputProps & {
  spaced?: boolean;
  icon?: string;
  backgroundColor?: Color;
  borderColor?: Color;
  iconColor?: Color;
  borderWidth?: number;
};

const TextInput: FC<TextInputProps> = ({
  spaced = false,
  icon = '',
  backgroundColor = colors.white,
  borderColor = colors.gradient1,
  iconColor = colors.gradient1,
  borderWidth = 2,
  ...props
}: TextInputProps) => {
  return (
    <View
      style={{
        ..._styles.textInput,
        backgroundColor: backgroundColor,
        ...styles.elevatedSmooth,
        marginBottom: spaced ? 24 : 0,
      }}>
      {icon ? <Icon name={icon} size={24} color={iconColor} /> : null}
      <RNTextInput
        style={_styles.textInputText}
        placeholderTextColor={colors.gray}
        {...props}
      />
    </View>
  );
};

const _styles = StyleSheet.create({
  textInput: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  textInputText: {
    flex: 1,
    ...styles.blackText,
    ...styles.textSmall,
    ...styles.textRegular,
  },
});

export default TextInput;

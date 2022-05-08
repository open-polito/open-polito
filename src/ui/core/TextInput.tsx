import React, {FC, useMemo} from 'react';
import {StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import colors from '../../colors';
import TablerIcon from './TablerIcon';
import {TextInput as RNTextInput, TextInputProps} from 'react-native';

type TextInputParams = {
  dark: boolean;
  icon?: string;
  inputStyle?: TextStyle;
  style?: ViewStyle;
} & TextInputProps;

const TextInput: FC<TextInputParams> = ({
  dark,
  icon = '',
  inputStyle = {},
  style = {},
  ...props
}) => {
  const _styles = useMemo(() => {
    return StyleSheet.create({
      textInputContainer: {
        backgroundColor: dark ? colors.gray700 : colors.gray200,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
      },
      textInput: {
        padding: 0,
        fontFamily: 'Inter-Regular',
        fontSize: 10,
        flex: 1,
        color: dark ? colors.gray200 : colors.gray700,
      },
    });
  }, [dark]);

  return (
    <View style={{..._styles.textInputContainer, ...(style as Object)}}>
      {icon ? (
        <TablerIcon
          name={icon}
          size={18}
          color={dark ? colors.gray200 : colors.gray700}
          style={{marginRight: 8}}
        />
      ) : null}
      <RNTextInput
        {...props}
        style={{
          ..._styles.textInput,
          ...(inputStyle as Object),
        }}
        placeholderTextColor={dark ? colors.gray300 : colors.gray600}
      />
    </View>
  );
};

export default TextInput;

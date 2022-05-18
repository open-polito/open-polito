import React, {FC, MutableRefObject, useEffect, useMemo, useRef} from 'react';
import {StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import colors from '../../colors';
import TablerIcon from './TablerIcon';
import {TextInput as RNTextInput, TextInputProps} from 'react-native';
import {p} from '../../scaling';

type TextInputParams = {
  dark: boolean;
  icon?: string;
  initiallyFocused?: boolean;
  inputStyle?: TextStyle;
  style?: ViewStyle;
} & TextInputProps;

const TextInput: FC<TextInputParams> = ({
  dark,
  icon = '',
  initiallyFocused = false,
  inputStyle = {},
  style = {},
  ...props
}) => {
  const ref = useRef<RNTextInput | null>(null);

  useEffect(() => {
    if (initiallyFocused) ref.current?.focus();
  }, [initiallyFocused]);

  const _styles = useMemo(() => {
    return StyleSheet.create({
      textInputContainer: {
        backgroundColor: dark ? colors.gray700 : colors.gray200,
        // paddingVertical: 8 * p,
        height: 40 * p,
        paddingHorizontal: 12 * p,
        borderRadius: 4 * p,
        flexDirection: 'row',
        alignItems: 'center',
      },
      textInput: {
        padding: 0,
        fontFamily: 'Inter-Regular',
        fontSize: 10 * p,
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
          size={18 * p}
          color={dark ? colors.gray200 : colors.gray700}
          style={{marginRight: 8 * p}}
        />
      ) : null}
      <RNTextInput
        ref={inputRef => (ref.current = inputRef)}
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

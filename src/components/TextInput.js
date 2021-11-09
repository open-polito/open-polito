import React from 'react';
import {StyleSheet, TextInput as RNTextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles';
import colors from '../colors';

export default function TextInput({
  placeholder,
  textContentType = 'none',
  icon = null,
  secureTextEntry = false,
  onChangeText = () => {},
}) {
  return (
    <View style={_styles.textInput}>
      {typeof icon == 'string' ? (
        <Icon name={icon} size={24} color={colors.gradient1} />
      ) : null}
      <RNTextInput
        placeholder={placeholder}
        textContentType={textContentType}
        secureTextEntry={secureTextEntry}
        style={_styles.textInputText}
        placeholderTextColor={colors.gray}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const _styles = StyleSheet.create({
  textInput: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    ...styles.withRoundedBorder,
    borderColor: colors.gradient1,
    width: '100%',
    paddingHorizontal: 8,
  },
  textInputText: {
    width: '100%',
    ...styles.blackText,
    ...styles.textSmall,
    ...styles.textRegular,
  },
});

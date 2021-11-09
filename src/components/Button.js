import React from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import colors from '../colors';
import {TextN} from './Text';

export default function Button({text, onPress}) {
  return (
    <View>
      <Pressable
        style={_styles.btn}
        android_ripple={{color: '#eee'}}
        onPress={onPress}>
        <TextN text={text} weight="medium" color="white" />
      </Pressable>
    </View>
  );
}

const _styles = StyleSheet.create({
  btn: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gradient1,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 4,
    elevation: 3,
  },
});

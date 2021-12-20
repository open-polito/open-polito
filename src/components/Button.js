import React from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import colors from '../colors';
import {TextN} from './Text';

export default function Button({text, onPress}) {
  return (
    <View style={{flexDirection: 'row'}}>
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gradient1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
});

import React from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import colors from '../colors';
import {TextS} from './Text';

export default function CategoryCard({category, size, style = {}}) {
  return (
    <View style={style}>
      <Pressable
        style={{..._styles.btn, width: size, height: size}}
        android_ripple={{color: '#ccc'}}
        // TODO onPress go to category
        // onPress={onPress}
      >
        <TextS text={category} weight="bold" color="black" />
      </Pressable>
    </View>
  );
}

const _styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: colors.white,
    paddingVertical: 16,
    borderRadius: 4,
    elevation: 4,
  },
});

import React from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import colors from '../colors';
import notImplemented from '../utils/not_implemented';
import {TextS} from './Text';
import {useTranslation} from 'react-i18next';

export default function CategoryCard({category, size, style = {}}) {
  const {t} = useTranslation();
  return (
    <View style={style}>
      <Pressable
        style={{..._styles.btn, width: size, height: size}}
        android_ripple={{color: '#ccc'}}
        // TODO onPress go to category
        onPress={() => {
          notImplemented(t);
        }}>
        <TextS text={category} weight="bold" color={colors.black} />
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

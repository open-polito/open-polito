import React from 'react';
import {Pressable, View} from 'react-native';
import colors from '../colors';
import styles from '../styles';
import {TextTitle} from './Text';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ArrowHeader({
  text = '',
  backFunc = () => {},
  color = colors.black,
}) {
  return (
    <View style={{...styles.titleBar, justifyContent: 'flex-start'}}>
      <Pressable onPress={backFunc} style={{marginRight: 16}}>
        <Icon name="arrow-back" color={colors.black} size={32} />
      </Pressable>
      <TextTitle color={color} text={text} />
    </View>
  );
}

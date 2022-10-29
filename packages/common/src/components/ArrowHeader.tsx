import React from 'react';
import {Pressable, View} from 'react-native';
import colors, {Color} from '../colors';
import styles from '../styles';
import {TextTitle} from './Text';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ArrowHeader = ({
  text = '',
  backFunc = () => {},
  color = colors.black,
  optionsFunction = null,
}: {
  text: string;
  backFunc?: Function;
  color?: Color;
  optionsFunction?: Function | null;
}) => {
  return (
    <View style={{...styles.titleBar, justifyContent: 'space-between'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <Pressable
          onPress={() => {
            backFunc();
          }}
          style={{marginRight: 16}}>
          <MaterialIcons name="arrow-back" color={colors.black} size={32} />
        </Pressable>
        <TextTitle color={color} text={text} />
      </View>
      {optionsFunction ? (
        <Pressable
          onPress={() => {
            optionsFunction();
          }}>
          <MaterialIcons name="more-vert" color={colors.black} size={32} />
        </Pressable>
      ) : null}
    </View>
  );
};

export default ArrowHeader;

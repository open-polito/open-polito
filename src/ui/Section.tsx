import React, {FC} from 'react';
import {View, ViewStyle} from 'react-native';
import colors from '../colors';
import {p} from '../scaling';
import Text from './core/Text';

export type SectionParams = {
  title: string;
  dark: boolean;
  style?: ViewStyle;
};

const Section: FC<SectionParams> = ({title, dark, style = {}, children}) => {
  return (
    <View style={{...style}}>
      <Text s={12 * p} w="m" c={dark ? colors.gray100 : colors.gray800}>
        {title}
      </Text>
      <View style={{marginTop: 16 * p}}>{children}</View>
    </View>
  );
};

export default Section;

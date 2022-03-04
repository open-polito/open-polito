import React, {useEffect, useState} from 'react';
import {Pressable, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../colors';
import styles from '../styles';
import {TextS} from './Text';

const HorizontalIconSelector = ({
  items,
  label = '',
  onValueChange,
  defaultValue = items[0].value,
}: {
  items: {icon: string; value: string}[];
  label?: string;
  onValueChange: Function;
  defaultValue?: string;
}) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    onValueChange(value);
  }, [value]);

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      {label ? <TextS text={label} style={{marginRight: 4}} /> : null}
      {items.map(item => (
        <Pressable
          onPress={() => {
            setValue(item.value);
          }}
          key={item.value}
          style={{
            marginLeft: 4,
            ...styles.border,
            ...styles.elevated,
            backgroundColor:
              item.value == value ? colors.gradient1 : colors.white,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 4,
          }}>
          <MaterialCommunityIcons
            name={item.icon}
            size={24}
            color={item.value == value ? colors.white : colors.gradient1}
          />
        </Pressable>
      ))}
    </View>
  );
};

export default HorizontalIconSelector;

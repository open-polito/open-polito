import React, {useState} from 'react';
import {View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import colors from '../colors';
import {TextS} from './Text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function DropdownSelector({placeholder, items, onValueChange}) {
  const [internalSelectedLabel, setInternalSelectedLabel] = useState(null);

  return (
    <RNPickerSelect
      items={items}
      onValueChange={(value, index) => {
        setInternalSelectedLabel(
          index == 0 ? placeholder.label : items[index - 1].label,
        );
        onValueChange(value, index);
      }}
      placeholder={placeholder}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: colors.lightGray,
          paddingHorizontal: 12,
          borderRadius: 32,
        }}>
        <TextS
          numberOfLines={1}
          text={
            internalSelectedLabel ? internalSelectedLabel : placeholder.label
          }
        />
        <Icon name="menu-down" size={24} />
      </View>
    </RNPickerSelect>
  );
}

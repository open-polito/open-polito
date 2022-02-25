import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, View} from 'react-native';
import colors from '../colors';
import {TextS} from './Text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HorizontalSelector = ({
  items,
  onValueChange,
}: {
  items: {label: string; value: string; icon?: string}[];
  onValueChange: Function;
}) => {
  const [value, setValue] = useState('');

  // Set initial value to first item
  useEffect(() => {
    !value && setValue(items[0].value);
  }, []);

  // Call onValueChange each time value is changed
  useEffect(() => {
    value && onValueChange(value);
  }, [value]);

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      horizontal
      contentContainerStyle={{
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
      }}>
      <View style={{paddingLeft: 24}} />
      {items.map(item => {
        const backgroundColor =
          value == item.value ? colors.gradient1 : colors.white;
        const color =
          backgroundColor == colors.gradient1 ? colors.white : colors.black;
        return (
          <Pressable
            key={item.value}
            android_ripple={{color: '#fff'}}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 4,
              backgroundColor: backgroundColor,
              borderRadius: 16,
              paddingHorizontal: 8,
              paddingVertical: 4,
              marginRight: 8,
              maxHeight: 24,
            }}
            onPress={() => {
              // Set selected item, which will call onValueChange
              setValue(item.value);
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {item.icon ? (
                <Icon
                  name={item.icon}
                  color={color}
                  style={{marginRight: 4}}
                  size={16}
                />
              ) : null}
              <TextS text={item.label} color={color} />
            </View>
          </Pressable>
        );
      })}
      <View style={{paddingRight: 16}} />
    </ScrollView>
  );
};

export default HorizontalSelector;

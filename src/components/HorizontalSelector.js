import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, View} from 'react-native';
import colors from '../colors';
import {TextS} from './Text';

export default function HorizontalSelector({items, onValueChange}) {
  /**
   * items: [
   *   {
   *     label: "Visible label",
   *     value: "itemValue"
   *   },
   *   ...
   * ]
   *
   */

  const [value, setValue] = useState(null);

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
        justifyContent: 'flex-start',
        paddingVertical: 8,
      }}>
      <View style={{paddingLeft: 24}} />
      {items.map(item => {
        const color = value == item.value ? colors.gradient1 : colors.white;
        return (
          <Pressable
            key={item.value}
            android_ripple={{color: '#fff'}}
            style={{
              elevation: 4,
              backgroundColor: color,
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 4,
              marginRight: 8,
              maxHeight: 24,
            }}
            onPress={() => {
              // Set selected item, which will call onValueChange
              setValue(item.value);
            }}>
            <View style={{height: '100%'}}>
              <TextS
                text={item.label}
                color={color == colors.gradient1 ? colors.white : colors.black}
              />
            </View>
          </Pressable>
        );
      })}
      <View style={{paddingRight: 16}} />
    </ScrollView>
  );
}

import React from 'react';
import {Pressable, View} from 'react-native';
import {TextN} from '../Text';

const ListSelectorDialog = ({
  items = [],
}: {
  items: {label: string; value: string}[];
}) => {
  return (
    <View>
      {items.map(item => (
        <Pressable key={item.value}>
          <TextN text={item.label} />
        </Pressable>
      ))}
    </View>
  );
};

export default ListSelectorDialog;

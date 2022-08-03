import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import colors from '../colors';
import {p} from '../scaling';
import Text from './core/Text';

const Filters = ({
  items,
  onChange,
}: {
  items: {label: string; value: string}[];
  onChange: (arg0: string) => any;
}) => {
  const [selected, setSelected] = useState<string>(items[0].value);

  return (
    <View style={{flexDirection: 'row'}}>
      {items.map(item => (
        <View>
          <TouchableOpacity
            onPress={() => {
              onChange(item.value);
              setSelected(item.value);
            }}>
            <View
              style={{
                paddingHorizontal: 8 * p,
                paddingVertical: 4 * p,
                borderWidth: 1 * p,
                borderRadius: 16 * p,
                borderColor:
                  item.value === selected ? colors.accent300 : colors.gray200,
                marginRight: 8 * p,
              }}>
              <Text
                s={10 * p}
                w="r"
                c={item.value === selected ? colors.accent300 : colors.gray200}>
                {item.label}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default Filters;

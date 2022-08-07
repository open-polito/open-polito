import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import colors from '../colors';
import {p} from '../scaling';
import PressableBase from './core/PressableBase';
import TablerIcon from './core/TablerIcon';
import Text from './core/Text';

const HorizontalIconSelector = ({
  items,
  label = '',
  onValueChange,
  defaultValue = items[0].value,
  dark,
}: {
  items: {icon: string; value: string}[];
  label?: string;
  onValueChange: Function;
  defaultValue?: string;
  dark: boolean;
}) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    onValueChange(value);
  }, [value]);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      {label ? (
        <Text
          s={10 * p}
          w="r"
          c={dark ? colors.gray100 : colors.gray800}
          style={{marginRight: 4 * p}}>
          {label}
        </Text>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: dark ? colors.gray700 : colors.gray200,
          marginLeft: 4 * p,
          borderRadius: 4 * p,
        }}>
        {items.map((item, i) => (
          <PressableBase
            onPress={() => {
              setValue(item.value);
            }}
            key={item.value}
            style={[
              {
                backgroundColor:
                  item.value == value ? colors.accent300 : 'rgba(0,0,0,0)',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 4 * p,
              },
              i === 0
                ? {
                    borderTopLeftRadius: 4 * p,
                    borderBottomLeftRadius: 4 * p,
                  }
                : i === items.length - 1
                ? {
                    borderTopRightRadius: 4 * p,
                    borderBottomRightRadius: 4 * p,
                  }
                : {},
            ]}>
            <TablerIcon
              name={item.icon}
              size={16 * p}
              color={
                item.value == value
                  ? colors.gray50
                  : dark
                  ? colors.gray200
                  : colors.gray700
              }
            />
          </PressableBase>
        ))}
      </View>
    </View>
  );
};

export default HorizontalIconSelector;

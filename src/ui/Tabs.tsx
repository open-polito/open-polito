import React, {FC, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, View, ViewStyle} from 'react-native';
import colors from '../colors';
import {p} from '../scaling';
import PressableBase from './core/PressableBase';
import Text from './core/Text';

// TODO animation

export type TabsParams = {
  adjusted?: boolean; // Proper margins
  items: {label: string; value: string}[];
  onChange: (i: number) => any;
  defaultIndex?: number;
  dark: boolean;
  style?: ViewStyle;
};

const Tabs: FC<TabsParams> = ({
  adjusted = false,
  items,
  onChange,
  defaultIndex = 0,
  dark,
  style = {},
}) => {
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

  const select = (index: number) => {
    setSelectedIndex(index);
    onChange(index);
  };

  const _styles = useMemo(() => {
    return StyleSheet.create({
      container: {},
      adjusted: {
        marginTop: 24 * p,
        paddingHorizontal: 16 * p,
      },
      tab: {},
      selectedIndicator: {
        marginTop: 4 * p,
        height: 2 * p,
        backgroundColor: colors.accent300,
      },
    });
  }, [dark, adjusted]);

  return (
    <View>
      <ScrollView
        contentContainerStyle={{
          ..._styles.container,
          ...style,
          ...(adjusted ? _styles.adjusted : {}),
        }}
        horizontal
        showsHorizontalScrollIndicator={false}>
        {items.map((tab, i) => (
          <View style={_styles.tab} key={tab.value}>
            <PressableBase
              style={{marginRight: 24 * p}}
              onPress={() => select(i)}>
              <Text
                s={12 * p}
                w="m"
                c={
                  i == selectedIndex
                    ? colors.accent300
                    : dark
                    ? colors.gray100
                    : colors.gray800
                }>
                {tab.label}
              </Text>
              {i == selectedIndex ? (
                <View style={_styles.selectedIndicator} />
              ) : null}
            </PressableBase>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Tabs;

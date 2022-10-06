import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import {TouchableOpacity} from 'react-native';
import colors from '../colors';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {p} from '../scaling';
import TablerIcon from '../ui/core/TablerIcon';
import Text from '../ui/core/Text';

const ListRank = ({
  items,
  callback,
  disabled,
  dark,
}: {
  items: Array<{label: string; value: string}>;
  callback: (data: string[]) => void;
  disabled: boolean;
  dark: boolean;
}) => {
  const [data, setData] = useState(items);

  useEffect(() => {
    callback(data.map(item => item.label));
  }, [data]);

  const renderItem = ({
    item,
    index,
    drag,
  }: RenderItemParams<{label: string; value: string}>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          disabled={disabled}
          onLongPress={drag}
          onPressIn={drag}
          onPress={drag}
          style={{
            paddingVertical: 4 * p,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginLeft: 0 * p,
              opacity: disabled ? 0.5 : 1,
            }}>
            <TablerIcon
              name="grid-dots"
              size={24 * p}
              color={dark ? colors.gray300 : colors.gray600}
            />
            <View style={{marginLeft: 8 * p}}>
              <Text s={12 * p} c={dark ? colors.gray100 : colors.gray800} w="r">
                {item.label}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <GestureHandlerRootView>
      <DraggableFlatList
        onDragEnd={({data}) => setData(data)}
        data={data}
        keyExtractor={item => item.value}
        renderItem={renderItem}
      />
    </GestureHandlerRootView>
  );
};

export default ListRank;

import React, {useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
  useOnCellActiveAnimation,
} from 'react-native-draggable-flatlist';
import {TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../colors';
import {TextN} from './Text';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const ListRank = ({
  items,
  callback,
  disabled,
}: {
  items: Array<{label: string; value: string}>;
  callback: (data: string[]) => void;
  disabled: boolean;
}) => {
  const length = useMemo(() => {
    return items.length;
  }, [items]);

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
          onPressIn={drag}
          onPress={drag}
          style={{
            paddingVertical: 8,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginLeft: -8,
              opacity: disabled ? 0.5 : 1,
            }}>
            <MaterialCommunityIcons
              name="drag"
              size={32}
              color={colors.mediumGray}
            />
            <TextN text={item.label} />
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <GestureHandlerRootView>
      <DraggableFlatList
        ItemSeparatorComponent={() => (
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: colors.lightGray,
            }}
          />
        )}
        onDragEnd={({data}) => setData(data)}
        data={data}
        keyExtractor={item => item.value}
        renderItem={renderItem}
      />
    </GestureHandlerRootView>
  );
};

export default ListRank;

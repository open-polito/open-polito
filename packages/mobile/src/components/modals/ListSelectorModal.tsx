import React, {FC, useCallback, useContext} from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import colors from '../../colors';
import {DeviceContext} from '../../context/Device';
import {ModalContext} from '../../context/ModalProvider';
import {p} from '../../scaling';
import Text from '../../ui/core/Text';
import ModalBase from './ModalBase';

export interface ListSelectorModalProps {
  title: string;
  items: {label: string; value: string}[];
  onSelect: (value: string) => any;
}

const ListSelectorModal: FC<ListSelectorModalProps> = ({
  title,
  items,
  onSelect,
}) => {
  const {dark} = useContext(DeviceContext);
  const {hideModal} = useContext(ModalContext);

  const _onSelect = useCallback(
    (value: string) => {
      onSelect(value);
      hideModal();
    },
    [onSelect, hideModal],
  );

  return (
    <ModalBase title={title} dismissable>
      {items.map(item => (
        <TouchableOpacity
          key={item.value}
          onPress={() => _onSelect(item.value)}>
          <View
            style={{
              paddingVertical: 8 * p,
            }}>
            <Text s={12 * p} w="r" c={dark ? colors.gray100 : colors.gray800}>
              {item.label}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ModalBase>
  );
};

export default ListSelectorModal;

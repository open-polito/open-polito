import React, {useContext} from 'react';
import {View} from 'react-native';
import colors from '../colors';
import {DeviceContext} from '../context/Device';
import {p} from '../scaling';
import Text from './core/Text';

const Fallback = () => {
  const {dark} = useContext(DeviceContext);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: dark ? colors.gray800 : colors.gray100,
      }}>
      <Text s={16 * p} w="m" c={dark ? colors.gray100 : colors.gray800}>
        LOADING...
      </Text>
    </View>
  );
};

export default Fallback;

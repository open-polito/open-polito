import React, {useContext} from 'react';
import {ActivityIndicator, View} from 'react-native';
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: dark ? colors.gray800 : colors.gray100,
      }}>
      <ActivityIndicator color={colors.accent300} size={32 * p} />
      <View style={{width: 16 * p}} />
      <Text s={16 * p} w="m" c={dark ? colors.gray100 : colors.gray800}>
        Loading...
      </Text>
    </View>
  );
};

export default Fallback;

import React, {ReactNode} from 'react';
import {View} from 'react-native';

const AnimatedGradientBase = ({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children: ReactNode;
}) => {
  return (
    <View
      style={{
        width,
        height,
      }}>
      {children}
    </View>
  );
};

export default AnimatedGradientBase;

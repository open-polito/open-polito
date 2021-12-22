import React, {useEffect, useRef} from 'react';
import {Animated, View} from 'react-native';
import colors from '../colors';

export default function AnimatedLiveCircle({width}) {
  const coeff = useRef(new Animated.Value(0)).current;

  const animate = () => {
    Animated.loop(
      Animated.timing(coeff, {
        toValue: 1.5,
        duration: 2000,
        useNativeDriver: true,
      }),
    ).start();
  };

  useEffect(animate, []);

  return (
    <View
      style={{
        width: width,
        height: width,
        borderRadius: width / 2,
      }}>
      <Animated.View
        style={[
          {
            backgroundColor: colors.white,
            width: width,
            height: width,
            borderRadius: width / 2,
            opacity: Animated.subtract(1.5, coeff),
          },
          {transform: [{scale: coeff}]},
        ]}></Animated.View>
      <View
        style={{
          position: 'absolute',
          left: width / 4,
          top: width / 4,
          width: width / 2,
          height: width / 2,
          borderRadius: width / 4,
          backgroundColor: colors.white,
        }}></View>
    </View>
  );
}

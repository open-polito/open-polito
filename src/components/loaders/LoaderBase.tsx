import React, {ReactNode, useEffect, useState} from 'react';
import {View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const LoaderBase = ({children}: {children: ReactNode}) => {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(true);

  const offset = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => {
    return {
      opacity: offset.value,
      transform: [
        {translateY: 8 - offset.value * 8},
        {translateX: 8 - offset.value * 8},
      ],
    };
  });

  useEffect(() => {
    (async () => {
      setTimeout(() => {
        mounted && setVisible(true);
      }, 150);
    })();
    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      offset.value = withTiming(1, {duration: 200});
    }
  }, [visible]);

  return visible ? (
    <Animated.View style={[animStyle]}>{children}</Animated.View>
  ) : null;
};

export default LoaderBase;

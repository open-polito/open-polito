import React, {FC} from 'react';
import {Pressable, PressableProps} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

/**
 * Basic pressable component.
 * All pressable components shall derive from this.
 * @param param0
 * @returns
 */
const PressableBase: FC<PressableProps> = ({children, ...props}) => {
  const offset = useSharedValue(1);

  const animStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          scale: offset.value,
        },
      ],
    }),
    [offset],
  );

  const setPressed = (val: boolean) => {
    offset.value = withTiming(val ? 0.95 : 1, {duration: 100});
  };

  return (
    <Animated.View style={[animStyle]}>
      <Pressable
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        {...props}>
        {children}
      </Pressable>
    </Animated.View>
  );
};

export default PressableBase;

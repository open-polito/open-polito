import React, {FC} from 'react';
import {Pressable, PressableProps, ViewProps} from 'react-native';
import Animated, {
  AnimateProps,
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
const PressableBase: FC<
  PressableProps & {
    parentStyle?: AnimateProps<ViewProps>['style'];
  }
> = ({children, ...props}) => {
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
    <Animated.View style={[animStyle, props.parentStyle]}>
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

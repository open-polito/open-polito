import React, {FC, useEffect} from 'react';
import {View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import colors from '../../colors';
import {p} from '../../scaling';
import PressableBase from './PressableBase';
import TablerIcon from './TablerIcon';

interface CheckboxProps {
  selected: boolean;
  onChange: (value: boolean) => any;
}

const Checkbox: FC<CheckboxProps> = ({selected, onChange}) => {
  const offset = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    width: 20 * p * offset.value,
    height: 20 * p * offset.value,
    borderRadius: 4 * p,
    backgroundColor: colors.accent300,
    alignItems: 'center',
    justifyContent: 'center',
  }));

  /**
   * Handle selection change
   */
  const handlePress = () => {
    // Callback function
    onChange(!selected);
  };

  /**
   * Animate on change
   */
  useEffect(() => {
    if (selected) {
      offset.value = withTiming(1, {duration: 100});
    } else {
      offset.value = withTiming(0, {duration: 100});
    }
  }, [selected]);

  return (
    <PressableBase style={{padding: 4 * p}} onPress={handlePress}>
      <View
        style={{
          width: 20 * p,
          height: 20 * p,
          backgroundColor: colors.gray700,
          borderColor: colors.gray600,
          borderWidth: 1 * p,
          borderRadius: 4 * p,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Animated.View style={[animStyle]}>
          <TablerIcon name="check" size={12 * p} color={colors.gray50} />
        </Animated.View>
      </View>
    </PressableBase>
  );
};

export default Checkbox;

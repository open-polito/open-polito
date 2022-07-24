import React from 'react';
import {View} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import colors from '../colors';
import {p} from '../scaling';
import Text from './core/Text';

const ProgressCircle = ({
  value,
  max,
  radius,
  strokeWidth = 4 * p,
}: {
  value: number | string;
  max: number;
  radius: number;
  strokeWidth?: number;
}) => {
  const circ = 2 * Math.PI * radius;

  return (
    <View style={{position: 'relative'}}>
      <Svg
        width={2 * (radius + strokeWidth)}
        height={2 * (radius + strokeWidth)}>
        <Circle
          transform={`rotate(-90 ${radius + strokeWidth} ${
            radius + strokeWidth
          })`}
          strokeWidth={strokeWidth}
          fill="transparent"
          stroke={colors.accent300}
          strokeDasharray={circ}
          strokeDashoffset={
            typeof value == 'number'
              ? ((100 - (100 * value) / max) * circ) / 100
              : 0
          }
          r={radius}
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}></Circle>
      </Svg>
      <View
        style={{
          position: 'absolute',
          width: 2 * (radius + strokeWidth),
          height: 2 * (radius + strokeWidth),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          s={typeof value == 'number' ? 16 * p : 10 * p}
          c={colors.gray100}
          w="b">
          {value}
        </Text>
      </View>
    </View>
  );
};

export default ProgressCircle;

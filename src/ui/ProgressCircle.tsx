import React, {ReactNode, useMemo, useState} from 'react';
import {View} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import colors, {Color} from '../colors';
import {p} from '../scaling';
import Text from './core/Text';

const ProgressCircle = ({
  label, // Optional label to display instead of the value
  value,
  max,
  radius,
  strokeWidth = 4 * p,
  fontSize,
  backgroundColor,
  dark,
  children,
}: {
  label?: string | null;
  value: number | string;
  max: number;
  radius: number;
  strokeWidth?: number;
  fontSize?: number;
  backgroundColor?: Color;
  dark: boolean;
  children?: ReactNode;
}) => {
  const circ = 2 * Math.PI * radius;

  const _value = useMemo(() => {
    return value <= max ? value : max; // Avoid going over max value
  }, [value, max]);

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
          fill={backgroundColor || 'transparent'}
          stroke={dark ? colors.gray700 : colors.gray200}
          r={radius}
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}></Circle>
        <Circle
          transform={`rotate(-90 ${radius + strokeWidth} ${
            radius + strokeWidth
          })`}
          strokeWidth={strokeWidth}
          fill={'transparent'}
          stroke={colors.accent300}
          strokeDasharray={circ}
          strokeDashoffset={
            typeof _value === 'number'
              ? ((100 - (100 * _value) / max) * circ) / 100
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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          s={
            fontSize || (label || typeof _value === 'string' ? 10 * p : 16 * p)
          }
          c={dark ? colors.gray100 : colors.gray800}
          w="b">
          {label || _value}
        </Text>
        {children}
      </View>
    </View>
  );
};

export default ProgressCircle;

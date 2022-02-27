import React from 'react';
import {Dimensions, View} from 'react-native';
import {Rect} from 'react-native-svg';
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient';
import styles from '../../styles';

export default function CourseLoader() {
  const w =
    Dimensions.get('window').width -
    2 * styles.withHorizontalPadding.paddingHorizontal;

  const r = 8; // border radius

  return (
    <View style={{flexDirection: 'column', ...styles.withHorizontalPadding}}>
      <SvgAnimatedLinearGradient height={200} width={w}>
        <Rect x={0} y={0} rx={r} ry={r} width="190" height="36" />
        <Rect x={0} y="48" rx={r} ry={r} width="128" height="24" />
        <Rect x={0} y="90" rx={r} ry={r} width={w} height="64" />
      </SvgAnimatedLinearGradient>
    </View>
  );
}

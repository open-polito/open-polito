import React, {ReactNode} from 'react';
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient';
import colors from '../../colors';

/**
 * Wraps {@link SvgAnimatedLinearGradient}
 */
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
    <SvgAnimatedLinearGradient
      width={width}
      height={height}
      primaryColor={colors.lightGray}
      secondaryColor={'#ccc'}
      x1={'-25%'}
      x2={'125%'}>
      {children}
    </SvgAnimatedLinearGradient>
  );
};

export default AnimatedGradientBase;

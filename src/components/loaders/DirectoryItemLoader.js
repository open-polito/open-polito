import React from 'react';
import {Rect} from 'react-native-svg';
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient';

export default function DirectoryItemLoader() {
  return (
    <SvgAnimatedLinearGradient height={50} width={375}>
      <Rect x="4" y="0" rx="4" ry="4" width="24" height="32" />
      <Rect x="40" y="0" rx="4" ry="4" width="170" height="16" />
      <Rect x="40" y="24" rx="4" ry="4" width="125" height="8" />
      <Rect x="310" y="8" rx="5" ry="5" width="55" height="16" />
    </SvgAnimatedLinearGradient>
  );
}

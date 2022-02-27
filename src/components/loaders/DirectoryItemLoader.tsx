import React from 'react';
import {Rect} from 'react-native-svg';
import AnimatedGradientBase from './AnimatedGradientBase';
import LoaderBase from './LoaderBase';

export default function DirectoryItemLoader() {
  return (
    <LoaderBase>
      <AnimatedGradientBase height={50} width={375}>
        <Rect x="4" y="0" rx="8" ry="8" width="24" height="32" />
        <Rect x="40" y="0" rx="8" ry="8" width="170" height="16" />
        <Rect x="40" y="24" rx="8" ry="8" width="125" height="8" />
        <Rect x="310" y="8" rx="8" ry="8" width="55" height="16" />
      </AnimatedGradientBase>
    </LoaderBase>
  );
}

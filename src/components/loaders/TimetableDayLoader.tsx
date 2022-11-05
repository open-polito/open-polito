import React, {useState} from 'react';
import {View} from 'react-native';
import {Rect} from 'react-native-svg';
import {p} from '../../scaling';
import AnimatedGradientBase from './AnimatedGradientBase';
import LoaderBase from './LoaderBase';

const TimetableDayLoader = ({w, h}: {w: number; h: number}) => {
  const [n] = useState(Math.ceil(Math.random() * 2));
  const [yPositions] = useState(
    Array.from({length: n}, (_, i) => (i + 1) * (3 + Math.random()) * h),
  );

  return (
    <View style={{height: h * 10, position: 'absolute'}}>
      <LoaderBase>
        <AnimatedGradientBase width={w} height={h * 15}>
          {Array.from({length: n}).map((_, i) => (
            <Rect
              key={i}
              x={0}
              y={yPositions[i]}
              rx={4 * p}
              ry={4 * p}
              width={w - 4}
              height={h * 2}
            />
          ))}
        </AnimatedGradientBase>
      </LoaderBase>
    </View>
  );
};

export default TimetableDayLoader;

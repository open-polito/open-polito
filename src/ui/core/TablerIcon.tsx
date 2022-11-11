import React from 'react';
import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import {IconProps} from 'react-native-vector-icons/Icon';
import icoMoonConfig from '../../../assets/fonts/selection-final.json';
import {p} from '../../scaling';

const GeneratedIconSet = createIconSetFromIcoMoon(
  icoMoonConfig,
  'tabler-icons',
  'tabler-icons.ttf',
);

const TablerIcon = ({...props}: IconProps) => {
  if (!props.size) {
    props.size = 24 * p;
  }

  return (
    <GeneratedIconSet
      {...props}
      style={[
        {
          ...(props.style as Object),
          lineHeight: props.size * 1.25, // Fix excessive bottom padding
        },
      ]}
    />
  );
};

export default TablerIcon;

import React, {FC} from 'react';
import {Platform} from 'react-native';
import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import {IconProps} from 'react-native-vector-icons/Icon';
import icoMoonConfig from '../../../assets/fonts/selection.json';
import {p} from '../../scaling';

const GeneratedIconSet = createIconSetFromIcoMoon(
  icoMoonConfig,
  'tabler-icons',
  'tabler-icons.ttf',
);

const TablerIcon: FC<IconProps> = ({...props}: IconProps) => {
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
        Platform.OS === 'web'
          ? {
              transform: [
                {
                  translateY: -props.size / 10,
                },
              ],
            }
          : {},
      ]}
    />
  );
};

export default TablerIcon;

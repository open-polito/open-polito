import React, {FC} from 'react';
import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import {IconProps} from 'react-native-vector-icons/Icon';
import icoMoonConfig from '../../../assets/fonts/selection.json';

const GeneratedIconSet = createIconSetFromIcoMoon(
  icoMoonConfig,
  'tabler-icons',
  'tabler-icons.ttf',
);

const TablerIcon: FC<IconProps> = ({...props}: IconProps) => {
  if (!props.size) props.size = 24;
  return (
    <GeneratedIconSet
      {...props}
      style={{...(props.style as Object), lineHeight: props.size * 1.25}} // Fix excessive bottom padding
    />
  );
};

export default TablerIcon;

import React from 'react';
import {createIconSet} from '@expo/vector-icons';
import {IconProps} from '@expo/vector-icons/build/createIconSet';
import {p} from '../../scaling';
import {GlyphName, glyphMap} from '../../utils/glyph-map';

const Icon = createIconSet(glyphMap, 'tabler-icons', 'tabler-icons.ttf');

const TablerIcon = ({...props}: IconProps<GlyphName>) => {
  if (!props.size) {
    props.size = 24 * p;
  }

  return (
    <Icon
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

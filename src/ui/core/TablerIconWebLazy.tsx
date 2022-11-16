import React, {CSSProperties, useMemo} from 'react';
import {IconProps} from '@expo/vector-icons/build/createIconSet';
import {View} from 'react-native';
import webIcons from '../../utils/webIcons';
import {p} from '../../scaling';
import {GlyphName} from '../../utils/glyph-map';

const TablerIconWebLazy = (props: IconProps<GlyphName>) => {
  const Component = useMemo(() => {
    const component = webIcons[props.name];
    if (component) {
      return component({
        size: props.size || 24 * p,
        color: props.color as string,
        style: props.style as CSSProperties,
      });
    }
    return null;
  }, [props]);

  return <View>{Component}</View>;
};

export default TablerIconWebLazy;

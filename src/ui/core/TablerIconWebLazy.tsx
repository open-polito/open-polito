import React, {CSSProperties, useMemo} from 'react';
import {IconProps} from 'react-native-vector-icons/Icon';
import {View} from 'react-native';
import webIcons from '../../utils/webIcons';
import {p} from '../../scaling';

const TablerIconWebLazy = (props: IconProps) => {
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

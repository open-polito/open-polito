import React, {FC} from 'react';
import {Pressable, PressableProps} from 'react-native';

/**
 * Basic pressable component.
 * All pressable components shall derive from this.
 * TODO implement visual behavior on touch etc...
 * @param param0
 * @returns
 */
const PressableBase: FC<PressableProps> = ({children, ...props}) => {
  return <Pressable {...props}>{children}</Pressable>;
};

export default PressableBase;

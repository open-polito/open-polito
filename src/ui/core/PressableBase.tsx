import React, {FC} from 'react';
import {Pressable} from 'react-native';

/**
 * Basic pressable component.
 * All pressable components shall derive from this.
 * TODO implement visual behavior on touch etc...
 * @param param0
 * @returns
 */
const PressableBase: FC = ({children}) => {
  return <Pressable>{children}</Pressable>;
};

export default PressableBase;

import React from 'react';
import {Pressable, View} from 'react-native';
import colors, {Color} from '../colors';
import styles from '../styles';
import NotificationButton from './NotificationButton';
import {TextTitle} from './Text';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Header = ({
  text = '',
  color = colors.black,
  optionsFunction = null,
}: {
  text: string;
  color?: Color;
  optionsFunction?: Function | null;
}) => {
  return (
    <View style={styles.titleBar}>
      {/* Title and notification container */}
      <TextTitle color={color} text={text} />
      {optionsFunction ? (
        <Pressable>
          <MaterialIcons name="more-vert" color={colors.black} size={32} />
        </Pressable>
      ) : null}
    </View>
  );
};

export default Header;

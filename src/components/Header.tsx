import React from 'react';
import {View} from 'react-native';
import colors from '../colors';
import styles from '../styles';
import NotificationButton from './NotificationButton';
import {TextTitle} from './Text';

const Header = ({text = '', color = colors.black}) => {
  return (
    <View style={styles.titleBar}>
      {/* Title and notification container */}
      <TextTitle color={color} text={text} />
      <NotificationButton color={color} />
    </View>
  );
};

export default Header;

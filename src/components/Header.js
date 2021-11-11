import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import colors from '../colors';
import styles from '../styles';
import NotificationButton from './NotificationButton';
import {TextTitle} from './Text';

export default function Header({text = '', color = colors.black}) {
  return (
    <View style={styles.titleBar}>
      {/* Title and notification container */}
      <TextTitle color={color} text={text} />
      <NotificationButton color={color} />
    </View>
  );
}

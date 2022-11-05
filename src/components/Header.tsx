import React from 'react';
import {Pressable, View} from 'react-native';
import colors, {Color} from '../colors';
import styles from '../styles';
import {TextTitle} from './Text';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconBadge from './IconBadge';

const Header = ({
  text = '',
  color = colors.black,
  optionsFunction = null,
  notificationsFunction = null,
  notificationsUnread = 0,
}: {
  text: string;
  color?: Color;
  optionsFunction?: Function | null; // Takes precedence over notificationsFunction
  notificationsFunction?: Function | null;
  notificationsUnread?: number;
}) => {
  return (
    <View style={{...styles.titleBar}}>
      {/* Title and notification container */}
      <TextTitle color={color} text={text} />
      {optionsFunction || notificationsFunction ? (
        <Pressable
          onPress={() => {
            optionsFunction
              ? optionsFunction()
              : notificationsFunction
              ? notificationsFunction()
              : null;
          }}>
          {optionsFunction ? (
            <MaterialIcons name="more-vert" color={colors.white} size={36} />
          ) : (
            <IconBadge
              name="bell"
              color={colors.white}
              size={36}
              number={notificationsUnread}
            />
          )}
        </Pressable>
      ) : null}
    </View>
  );
};

export default Header;

import React from 'react';
import {StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../colors';
import {TextS} from './Text';

export default function IconBadge({name, color, size, number = 0}) {
  const badgeText = number > 99 ? '99+' : number;

  return (
    <View>
      <Icon name={name} color={color} size={size} />
      {number > 0 ? (
        <View style={_styles.badge}>
          <TextS style={_styles.badgeText} text={badgeText} weight="medium" />
        </View>
      ) : null}
    </View>
  );
}

const _styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.red,
    width: 24,
    height: 24,
    borderRadius: 24,
    position: 'absolute',
    top: -8,
    right: -16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: colors.white,
  },
});

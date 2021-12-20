import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../colors';
import {TextN, TextS} from './Text';

export default function SettingsItem({
  iconName,
  text,
  description,
  settingsFunction = () => {},
}) {
  return (
    <View>
      <Pressable android_ripple={{color: '#ccc'}} onPress={settingsFunction}>
        <View style={_styles.settingsItemContainer}>
          <Icon name={iconName} size={32} color={colors.black} />
          <View style={_styles.settingsItemTextContainer}>
            <TextN text={text} weight="medium" />
            <TextS text={description} />
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const _styles = StyleSheet.create({
  settingsItemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 8,
    paddingLeft: -8,
    paddingVertical: 12,
  },
  settingsItemTextContainer: {
    marginLeft: 12,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});

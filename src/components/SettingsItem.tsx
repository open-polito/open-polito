import React, {FC} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../colors';
import {TextN, TextS} from './Text';

export type SettingsItemProps = {
  icon: string;
  name: string;
  description: string;
  settingsFunction: Function;
};

const SettingsItem: FC<SettingsItemProps> = ({
  icon,
  name,
  description,
  settingsFunction = () => {},
  children,
}) => {
  return (
    <View style={{flex: 1}}>
      <Pressable
        android_ripple={{color: '#ccc'}}
        onPress={() => {
          settingsFunction();
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{..._styles.settingsItemContainer, flex: 1}}>
            <Icon name={icon} size={32} color={colors.black} />
            <View style={_styles.settingsItemTextContainer}>
              <TextN text={name} weight="medium" />
              <TextS text={description} />
            </View>
          </View>
          {children}
        </View>
      </Pressable>
    </View>
  );
};

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

export default SettingsItem;

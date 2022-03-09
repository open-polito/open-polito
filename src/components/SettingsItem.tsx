import React, {FC, ReactNode} from 'react';
import {Pressable, StyleSheet, Switch, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../colors';
import {TextN, TextS} from './Text';

export type SettingsItemProps = {
  icon?: string;
  name: string;
  description?: string;
  disabled?: boolean;
  settingsFunction: Function;
  toggle?: boolean; // whether to show toggle
  toggleValue?: boolean; // value of toggle
  children?: ReactNode;
};

const SettingsItem: FC<SettingsItemProps> = ({
  icon,
  name,
  description,
  disabled = false,
  settingsFunction = () => {},
  toggle = false,
  toggleValue,
  children,
}) => {
  return (
    <View style={{flex: 1}}>
      <Pressable
        disabled={disabled}
        android_ripple={{color: '#ccc'}}
        onPress={() => {
          settingsFunction();
        }}
        style={{opacity: disabled ? 0.3 : 1}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={[
              {..._styles.settingsItemContainer, flex: 1},
              children ? {paddingBottom: 0} : {},
            ]}>
            {icon ? <Icon name={icon} size={28} color={colors.black} /> : null}
            <View
              style={[
                _styles.settingsItemTextContainer,
                {
                  marginLeft: icon
                    ? _styles.settingsItemTextContainer.marginLeft
                    : 0,
                },
              ]}>
              <TextN text={name} numberOfLines={1} weight="medium" />
              {description ? <TextS text={description} /> : null}
            </View>
          </View>
          {toggle && (
            <View style={{paddingLeft: 32}}>
              <Switch
                value={toggleValue}
                onValueChange={() => {
                  settingsFunction();
                }}
              />
            </View>
          )}
        </View>
      </Pressable>
      {children}
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

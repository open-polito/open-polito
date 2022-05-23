import React, {FC, ReactNode, useContext, useMemo} from 'react';
import {Pressable, StyleSheet, Switch, View} from 'react-native';
import colors from '../colors';
import {TextN, TextS} from '../components/Text';
import {DeviceContext} from '../context/Device';
import {p} from '../scaling';
import PressableBase from './core/PressableBase';
import TablerIcon from './core/TablerIcon';
import Text from './core/Text';

export type SettingsItemProps = {
  icon?: string;
  name: string;
  description?: string;
  disabled?: boolean;
  settingsFunction: () => any;
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
  const {dark} = useContext(DeviceContext);

  const _styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8 * p,
      },
      textContainer: {
        flex: 1,
        marginLeft: 12 * p,
        flexDirection: 'column',
        justifyContent: 'flex-start',
      },
    });
  }, [dark]);

  return (
    <PressableBase
      onPress={settingsFunction}
      android_ripple={{color: colors.gray200}}
      style={[_styles.container, disabled ? {opacity: 0.3} : {}]}>
      {icon ? (
        <TablerIcon
          name={icon}
          size={24 * p}
          color={dark ? colors.gray300 : colors.gray600}
        />
      ) : null}
      <View style={_styles.textContainer}>
        <Text
          w="m"
          s={12 * p}
          c={dark ? colors.gray100 : colors.gray800}
          style={{marginBottom: 2 * p}}>
          {name}
        </Text>
        {description ? (
          <Text w="r" s={10 * p} c={dark ? colors.gray200 : colors.gray700}>
            {description}
          </Text>
        ) : null}
      </View>
      {toggle ? (
        <Switch value={toggleValue} onChange={settingsFunction} />
      ) : null}
    </PressableBase>
  );
};
export default SettingsItem;

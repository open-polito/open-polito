import React, {ReactNode, useContext, useMemo} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import colors from '../colors';
import {DeviceContext} from '../context/Device';

const Screen = ({children}: {children: ReactNode}) => {
  const {dark, chosenTheme} = useContext(DeviceContext);

  const _styles = useMemo(() => {
    return StyleSheet.create({
      screen: {
        backgroundColor: dark ? colors.gray800 : colors.gray100,
        flex: 1,
      },
    });
  }, [dark]);

  return (
    <View style={{flex: 1}}>
      <StatusBar
        barStyle={
          chosenTheme === 'system'
            ? 'default'
            : dark
            ? 'dark-content'
            : 'light-content'
        }
      />
      <View style={_styles.screen}>{children}</View>
    </View>
  );
};

export default Screen;

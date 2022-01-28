import React from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import colors from '../colors';
import styles from '../styles';

export default function ScreenContainer({
  children,
  style,
  barStyle = 'dark-content',
}) {
  const _style = style != undefined && style;
  return (
    <SafeAreaView style={{height: '100%'}}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={barStyle}
      />
      <View
        style={{
          ...styles.container,
          ...styles.safePaddingTop,
          ...styles.withHorizontalPadding,
          backgroundColor: colors.background,
          ..._style,
        }}>
        {children}
      </View>
    </SafeAreaView>
  );
}

import React from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import colors from '../colors';
import styles from '../styles';

export default function ScreenContainer({children, style}) {
  const _style = style != undefined && style;
  return (
    <SafeAreaView style={{height: '100%'}}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View
        style={{
          ...styles.container,
          ...styles.safePaddingTop,
          ...styles.withHorizontalPadding,
          backgroundColor: colors.white,
          ..._style,
        }}>
        {children}
      </View>
    </SafeAreaView>
  );
}

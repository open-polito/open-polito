import React, {FC} from 'react';
import {SafeAreaView, StatusBar, View, ViewStyle} from 'react-native';
import colors from '../colors';
import styles from '../styles';

export type ScreenContainerProps = {
  style: ViewStyle;
  barStyle: 'light-content' | 'dark-content';
};

const ScreenContainer: FC<ScreenContainerProps> = ({
  children,
  style = {},
  barStyle = 'dark-content',
}) => {
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
          backgroundColor: colors.background,
          ...style,
        }}>
        {children}
      </View>
    </SafeAreaView>
  );
};

export default ScreenContainer;

import React from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import colors from '../colors';
import Header from '../components/Header';
import styles from '../styles';

export default function Settings() {
  const {windowHeight} = useSelector(state => state.ui);

  return (
    <SafeAreaView style={{height: windowHeight - styles.tabNavigator.height}}>
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
          height: windowHeight,
        }}>
        <Header text="Settings" noMarginBottom={true} />
        <ScrollView></ScrollView>
      </View>
    </SafeAreaView>
  );
}

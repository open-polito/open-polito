import React from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import colors from '../colors';
import AccountBox from '../components/AccountBox';
import Header from '../components/Header';
import SettingsItem from '../components/SettingsItem';
import styles from '../styles';

export default function Settings() {
  const {windowHeight} = useSelector(state => state.ui);
  const anagrafica = useSelector(state => state.session.anagrafica);

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
        <ScrollView>
          <AccountBox
            name={anagrafica.nome + ' ' + anagrafica.cognome}
            degree={anagrafica.nome_corso_laurea}
            logoutFunction={() => console.log('Logout...')}
          />
          <View style={{marginTop: 24}}>
            <SettingsItem
              iconName="notifications"
              text="Notifications"
              description="Manage your notification preferences"
            />
            <SettingsItem
              iconName="color-lens"
              text="Theme"
              description="Choose dark mode, customize colors"
            />
            <SettingsItem
              iconName="info-outline"
              text="About"
              description="About Open PoliTo"
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

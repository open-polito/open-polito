import React from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import colors from '../colors';
import AccountBox from '../components/AccountBox';
import Header from '../components/Header';
import SettingsItem from '../components/SettingsItem';
import styles from '../styles';
import {useDispatch} from 'react-redux';
import * as Keychain from 'react-native-keychain';
import {setAccess, setToken, setUsername, setUuid} from '../store/sessionSlice';
import {showMessage} from 'react-native-flash-message';
import {logoutFlashMessage} from '../components/CustomFlashMessages';
import {useTranslation} from 'react-i18next';
import notImplemented from '../utils/not_implemented';

export default function Settings() {
  const {t} = useTranslation();
  const {windowHeight} = useSelector(state => state.ui);
  const anagrafica = useSelector(state => state.session.anagrafica);

  const dispatch = useDispatch();

  function showLogoutMessage() {
    showMessage(logoutFlashMessage(t));
  }

  function handleLogout() {
    showLogoutMessage();
    logout();
  }

  function logout() {
    setTimeout(async () => {
      await Keychain.resetGenericPassword();
      dispatch(setUuid(null));
      dispatch(setToken(null));
      dispatch(setUsername(null));
      dispatch(setAccess(false));
    }, 1000);
  }

  return (
    <SafeAreaView
      style={{
        height: windowHeight - styles.tabNavigator.height,
      }}>
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
        <Header text={t('settings')} noMarginBottom={true} />
        <ScrollView style={styles.paddingFromHeader}>
          <AccountBox
            name={anagrafica.nome + ' ' + anagrafica.cognome}
            degree={anagrafica.nome_corso_laurea}
            logoutFunction={handleLogout}
          />
          <View style={{marginTop: 24}}>
            <SettingsItem
              iconName="notifications"
              text={t('notifications')}
              description={t('notificationsDesc')}
              settingsFunction={() => {
                notImplemented(t);
              }}
            />
            <SettingsItem
              iconName="color-lens"
              text={t('theme')}
              description={t('themeDesc')}
              settingsFunction={() => {
                notImplemented(t);
              }}
            />
            <SettingsItem
              iconName="info-outline"
              text={t('about')}
              description={t('aboutDesc')}
              settingsFunction={() => {
                notImplemented(t);
              }}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

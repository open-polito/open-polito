import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, Switch, View} from 'react-native';
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
import {
  logoutFlashMessage,
  warnFlashMessage,
} from '../components/CustomFlashMessages';
import {useTranslation} from 'react-i18next';
import notImplemented from '../utils/notImplemented';
import {TextS} from '../components/Text';
import ScreenContainer from '../components/ScreenContainer';
import ArrowHeader from '../components/ArrowHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings() {
  const {t} = useTranslation();
  const {windowHeight} = useSelector(state => state.ui);
  const anagrafica = useSelector(state => state.session.anagrafica);

  const [mounted, setMounted] = useState(true);

  const dispatch = useDispatch();

  // Settings state to persist
  const [config, setConfig] = useState({
    logging: false,
  });

  // Load config from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const _config = await AsyncStorage.getItem('@config');
        mounted && setConfig(JSON.parse(_config));
      } catch (e) {}
    })();
    return () => setMounted(false);
  }, []);

  // Save config to AsyncStorage on config change
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem('@config', JSON.stringify(config));
      } catch (e) {
        console.error(e);
      }
    })();
  }, [config]);

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

  const toggleLogging = () => {
    showMessage(warnFlashMessage(t, 'restartFlashMessage'));
  };

  return (
    <ScreenContainer style={{paddingHorizontal: 0}}>
      <View style={styles.withHorizontalPadding}>
        <Header text={t('settings')} padd />
      </View>
      <ScrollView
        contentContainerStyle={{
          ...styles.withHorizontalPadding,
          ...styles.paddingFromHeader,
        }}>
        <View>
          <AccountBox
            name={anagrafica.nome + ' ' + anagrafica.cognome}
            degree={anagrafica.nome_corso_laurea}
            logoutFunction={handleLogout}
          />
        </View>
        <View style={{marginTop: 24}}>
          <SettingsItem
            iconName="bell-alert-outline"
            text={t('notifications')}
            description={t('notificationsDesc')}
            settingsFunction={() => {
              notImplemented(t);
            }}
          />
          <SettingsItem
            iconName="drawing"
            text={t('theme')}
            description={t('themeDesc')}
            settingsFunction={() => {
              notImplemented(t);
            }}
          />
          <SettingsItem
            iconName="information-outline"
            text={t('about')}
            description={t('aboutDesc')}
            settingsFunction={() => {
              notImplemented(t);
            }}
          />
          {/* Debug options */}
          <View style={{height: 4, backgroundColor: colors.lightGray}}></View>
          <TextS style={{marginTop: 8}} text={t('debugSettings')} />
          <SettingsItem
            iconName="bug-outline"
            text={t('enableLogging')}
            description={t('enableLoggingDesc')}
            settingsFunction={() => {
              const _value = config.logging;
              setConfig({...config, logging: !_value});
              toggleLogging();
            }}>
            <Switch
              value={config.logging}
              onValueChange={value => {
                setConfig({...config, logging: value});
                toggleLogging();
              }}
            />
          </SettingsItem>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

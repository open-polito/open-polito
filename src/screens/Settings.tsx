import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, Switch, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import colors from '../colors';
import AccountBox from '../components/AccountBox';
import Header from '../components/Header';
import SettingsItem, {SettingsItemProps} from '../components/SettingsItem';
import styles from '../styles';
import {useDispatch} from 'react-redux';
import * as Keychain from 'react-native-keychain';
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
import {RootState} from '../store/store';
import {Anagrafica} from 'open-polito-api/user';
import {logout} from '../store/sessionSlice';
import {DeviceContext} from '../context/Device';
import {createDevice} from '../utils/api-utils';
import {Device} from 'open-polito-api';
import {getLoggingConfig, requestLogger} from '../routes/Router';
import defaultConfig, {Config} from '../defaultConfig';

export default function Settings() {
  const {t} = useTranslation();

  const deviceContext = useContext(DeviceContext);

  const userInfo = useSelector<RootState, Anagrafica | null>(
    state => state.user.userInfo,
  );

  const [mounted, setMounted] = useState(true);

  const dispatch = useDispatch();

  // Settings state to persist
  const [config, setConfig] = useState<Config>(defaultConfig);

  const [loadedConfig, setLoadedConfig] = useState(false);

  // Load config from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const _config: Config = JSON.parse(
          (await AsyncStorage.getItem('@config')) || '',
        );
        mounted && setConfig(_config);
        mounted && setLoadedConfig(true);
      } catch (e) {}
    })();
    return () => setMounted(false);
  }, []);

  // Save config to AsyncStorage on config change
  useEffect(() => {
    if (!loadedConfig) return;
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
    (async () => {
      showLogoutMessage();
      try {
        await AsyncStorage.multiRemove(['@config']);
      } catch (e) {}
      // We create another Device because we need to reset current device from context
      dispatch(
        logout(
          new Device(
            deviceContext.device.uuid,
            10000,
            (await getLoggingConfig()) ? requestLogger : () => {},
          ),
        ),
      );
      // Reset context device
      deviceContext.setDevice(new Device(''));
    })();
  }

  const showRestartAppNeeded = () => {
    showMessage(warnFlashMessage(t, 'restartFlashMessage'));
  };

  const settingsItems: SettingsItemProps[] = [
    {
      icon: 'bell-alert-outline',
      name: t('notifications'),
      description: t('notificationsDesc'),
      settingsFunction: () => notImplemented(t),
    },
    {
      icon: 'drawing',
      name: t('theme'),
      description: t('themeDesc'),
      settingsFunction: () => notImplemented(t),
    },
    {
      icon: 'information-outline',
      name: t('about'),
      description: t('aboutDesc'),
      settingsFunction: () => notImplemented(t),
    },
  ];

  const debugSettingsItems: SettingsItemProps[] = [
    {
      icon: 'bug-outline',
      name: t('debugEnableLogging'),
      description: t('debugEnableLoggingDesc'),
      settingsFunction: () => {
        setConfig({...config, logging: !config.logging});
        showRestartAppNeeded();
      },
      toggle: true,
      toggleValue: config.logging,
    },
  ];

  const experimentalSettingsItems: SettingsItemProps[] = [
    {
      icon: 'email-outline',
      name: t('experimentalEmailWebView'),
      description: t('experimentalEmailWebViewDesc'),
      settingsFunction: () => {
        setConfig({...config, emailWebView: !config.emailWebView});
      },
      toggle: true,
      toggleValue: config.emailWebView,
    },
  ];

  const buildSettingsItem = (item: SettingsItemProps) => {
    return <SettingsItem {...item} />;
  };

  return (
    <ScreenContainer style={{paddingHorizontal: 0}}>
      <View style={styles.withHorizontalPadding}>
        <Header text={t('settings')} />
      </View>
      <ScrollView
        contentContainerStyle={{
          ...styles.withHorizontalPadding,
          ...styles.paddingFromHeader,
        }}>
        <View>
          <AccountBox
            name={userInfo?.nome + ' ' + userInfo?.cognome}
            degree={userInfo?.nome_corso_laurea}
            logoutFunction={handleLogout}
          />
        </View>
        <View style={{marginTop: 24}}>
          {settingsItems.map(item => buildSettingsItem(item))}
          {/* Debug options */}
          <View
            style={{
              height: 4,
              backgroundColor: colors.lightGray,
              borderRadius: 4,
            }}></View>
          <TextS style={{marginTop: 8}} text={t('debugSettings')} />
          {debugSettingsItems.map(item => buildSettingsItem(item))}
          {/* Experimental options */}
          <View
            style={{
              height: 4,
              backgroundColor: colors.lightGray,
              borderRadius: 4,
            }}></View>
          <TextS style={{marginTop: 8}} text={t('experimentalSettings')} />
          {experimentalSettingsItems.map(item => buildSettingsItem(item))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

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

export default function Settings() {
  const {t} = useTranslation();

  const deviceContext = useContext(DeviceContext);

  const userInfo = useSelector<RootState, Anagrafica | null>(
    state => state.user.userInfo,
  );

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
        const _config = (await AsyncStorage.getItem('@config')) || '';
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

  const toggleLogging = () => {
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

  const buildSettingsItem = (item: SettingsItemProps) => {
    return (
      <SettingsItem
        key={item.name}
        icon={item.icon}
        name={item.name}
        description={item.description}
        settingsFunction={item.settingsFunction}
      />
    );
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
          <View style={{height: 4, backgroundColor: colors.lightGray}}></View>
          <TextS style={{marginTop: 8}} text={t('debugSettings')} />
          <SettingsItem
            icon="bug-outline"
            name={t('enableLogging')}
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

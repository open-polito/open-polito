import React, {useContext, useEffect, useMemo, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Switch, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import SettingsItem, {SettingsItemProps} from '../ui/SettingsItem';
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
import {AppDispatch, RootState} from '../store/store';
import {
  logout,
  resetConfig,
  setConfig,
  setConfig as _setConfig,
  setDialog,
  setToast,
} from '../store/sessionSlice';
import {DeviceContext} from '../context/Device';
import {createDevice} from '../utils/api-utils';
import {Device} from 'open-polito-api/device';
import defaultConfig, {Configuration} from '../defaultConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import WIPInfoWidget from '../components/widgets/WIPInfoWidget';
import {PersonalData} from 'open-polito-api/user';
import {sendTestPushNotification} from 'open-polito-api/notifications';
import Analytics from 'appcenter-analytics';
import {version} from '../version.json';
import Screen from '../ui/Screen';
import Header, {HEADER_TYPE} from '../ui/Header';
import Section from '../ui/Section';
import {p} from '../scaling';

/**
 * Creates Settings item component from data
 * @param item Settings item data
 * @returns Settings item component
 */
export const buildSettingsItem = (item: SettingsItemProps) => {
  return <SettingsItem key={item.name} {...item} />;
};

export default function Settings() {
  const {t} = useTranslation();

  const {dark, device, setDevice} = useContext(DeviceContext);

  const userInfo = useSelector<RootState, PersonalData | null>(
    state => state.user.userInfo,
  );
  const config = useSelector<RootState, Configuration>(
    state => state.session.config,
  );

  const dispatch = useDispatch<AppDispatch>();

  const _setConfig = (config: Configuration) => {
    dispatch(setConfig(config));
  };

  const showRestartAppNeeded = () => {
    dispatch(
      setToast({
        message: t('restartToastMessage'),
        type: 'warn',
        visible: true,
      }),
    );
  };

  const settingsItems: SettingsItemProps[] = [
    // {
    //   icon: 'bell',
    //   name: t('notifications'),
    //   description: t('notificationsDesc'),
    //   settingsFunction: () => notImplemented(t),
    // },
    // {
    //   icon: 'moon-stars',
    //   name: t('darkMode'),
    //   settingsFunction: () => notImplemented(t),
    //   toggle: true,
    //   toggleValue: config.theme == 'dark',
    // },
    // {
    //   icon: 'info-circle',
    //   name: t('about'),
    //   description: t('aboutDesc'),
    //   settingsFunction: () => notImplemented(t),
    // },
  ];

  const debugSettingsItems: SettingsItemProps[] = [
    {
      icon: 'bug',
      name: t('debugEnableLogging'),
      description: t('debugEnableLoggingDesc'),
      settingsFunction: () => {
        if (!config.logging) {
          dispatch(
            setDialog({
              visible: true,
              params: {
                type: 'SETTINGS_ENABLE_LOGGING',
              },
            }),
          );
        } else {
          dispatch(setConfig({...config, logging: false}));
        }
      },
      toggle: true,
      toggleValue: config.logging,
    },
    {
      icon: 'arrow-back',
      name: t('debugResetConfig'),
      description: t('debugResetConfigDesc'),
      settingsFunction: () => {
        dispatch(resetConfig());
      },
    },
    {
      icon: 'bell-ringing',
      name: t('debugTestNotification'),
      description: t('debugTestNotificationDesc'),
      settingsFunction: () => {
        dispatch(
          setToast({message: t('pleaseWait'), type: 'info', visible: true}),
        );
        (async () => {
          await sendTestPushNotification(device);
          await Analytics.trackEvent('test_notification_request');
        })();
      },
    },
  ];

  const experimentalSettingsItems: SettingsItemProps[] = [];

  const _styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        marginTop: 24 * p,
        paddingHorizontal: 16 * p,
        paddingBottom: 16 * p,
      },
    });
  }, [dark]);

  return (
    <Screen>
      <Header headerType={HEADER_TYPE.MAIN} title={t('settings')} />
      <View style={_styles.container}>
        {/* <Section dark={dark} title={t('generalSettings')}>
          {settingsItems.map(item => buildSettingsItem(item))}
        </Section> */}

        {/* Debug options */}
        {parseInt(Config.ENABLE_DEBUG_OPTIONS) ? (
          <Section dark={dark} title={t('debugSettings')}>
            <View style={{marginTop: -8 * p}}>
              {debugSettingsItems.map(item => buildSettingsItem(item))}
            </View>
          </Section>
        ) : null}
        {/* Experimental options */}
        {/* {parseInt(Config.ENABLE_EXPERIMENTAL_OPTIONS) ? (
          <Section dark={dark} title={t('experimentalSettings')}>
            <View>
              {experimentalSettingsItems.map(item => buildSettingsItem(item))}
            </View>
          </Section>
        ) : null} */}
      </View>
      <View
        style={{
          marginTop: 8,
          marginBottom: 16,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <TextS text={'v' + version} />
      </View>
    </Screen>
  );
}

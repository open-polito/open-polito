import React, {useContext, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import SettingsItem, {SettingsItemProps} from '../ui/SettingsItem';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {AppDispatch, RootState} from '../store/store';
import {resetConfig, setConfig, setToast} from '../store/sessionSlice';
import {DeviceContext} from '../context/Device';
import {Configuration} from '../defaultConfig';
import Config from 'react-native-config';
import {sendTestPushNotification} from 'open-polito-api/lib/notifications';
import Analytics from 'appcenter-analytics';
import version from '../../version.json';
import Screen from '../ui/Screen';
import Header, {HEADER_TYPE} from '../ui/Header';
import Section from '../ui/Section';
import {p} from '../scaling';
import Text from '../ui/core/Text';
import colors from '../colors';
import SettingsEnableLoggingModal from '../components/modals/SettingsEnableLoggingModal';
import {ModalContext} from '../context/ModalProvider';

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

  const {dark, device} = useContext(DeviceContext);

  const {setModal} = useContext(ModalContext);

  const config = useSelector<RootState, Configuration>(
    state => state.session.config,
  );

  const dispatch = useDispatch<AppDispatch>();

  // const _setConfig = (config: Configuration) => {
  //   dispatch(setConfig(config));
  // };

  // const showRestartAppNeeded = () => {
  //   dispatch(
  //     setToast({
  //       message: t('restartToastMessage'),
  //       type: 'warn',
  //       visible: true,
  //     }),
  //   );
  // };

  // const settingsItems: SettingsItemProps[] = [
  //   {
  //     icon: 'bell',
  //     name: t('notifications'),
  //     description: t('notificationsDesc'),
  //     settingsFunction: () => notImplemented(t),
  //   },
  //   {
  //     icon: 'moon-stars',
  //     name: t('darkMode'),
  //     settingsFunction: () => notImplemented(t),
  //     toggle: true,
  //     toggleValue: config.theme == 'dark',
  //   },
  //   {
  //     icon: 'info-circle',
  //     name: t('about'),
  //     description: t('aboutDesc'),
  //     settingsFunction: () => notImplemented(t),
  //   },
  // ];

  const debugSettingsItems: SettingsItemProps[] = [
    {
      icon: 'bug',
      name: t('debugEnableLogging'),
      description: t('debugEnableLoggingDesc'),
      settingsFunction: () => {
        if (!config.logging) {
          setModal(<SettingsEnableLoggingModal />);
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
        })();
      },
    },
  ];

  // const experimentalSettingsItems: SettingsItemProps[] = [];

  const _styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        marginTop: 24 * p,
        paddingHorizontal: 16 * p,
        paddingBottom: 16 * p,
      },
    });
  }, []);

  return (
    <Screen>
      <Header headerType={HEADER_TYPE.MAIN} title={t('settings')} />
      <View style={_styles.container}>
        {/* <Section dark={dark} title={t('generalSettings')}>
          {settingsItems.map(item => buildSettingsItem(item))}
        </Section> */}

        {/* Debug options */}
        {parseInt(Config.ENABLE_DEBUG_OPTIONS!) ? (
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
        <Text s={10 * p} w="r" c={dark ? colors.gray200 : colors.gray700}>
          {'v' + version.version}
        </Text>
      </View>
    </Screen>
  );
}

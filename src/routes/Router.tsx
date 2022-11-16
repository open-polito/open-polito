import React, {
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {View} from 'react-native';
import colors from '../colors';
import {useTranslation} from 'react-i18next';

import {useSelector} from 'react-redux';
import {SessionState} from '../store/sessionSlice';
import {Configuration} from '../defaultConfig';
import {AUTH_STATUS} from '../store/status';
import {RootState} from '../store/store';
import {
  checkForUpdates,
  ReleaseJsonEntry,
  updateCleanup,
} from '../utils/updater';
import {ModalContext} from '../context/ModalProvider';
import BaseActionConfirmModal from '../components/modals/BaseActionConfirmModal';
import Text from '../ui/core/Text';
import {p} from '../scaling';
import {DeviceContext} from '../context/Device';
import {getLocales} from 'react-native-localize';
import {RenderHTMLSource} from 'react-native-render-html';
import Updater from '../screens/Updater';
import AppStackNavigator from './AppStackNavigator';
import {getLanguageCode, setMomentLocale} from '../utils/l10n';
import {genericPlatform} from '../utils/platform';
import HTMLRenderEngineProvider from '../context/HTMLRenderEngineProvider';

/**
 * Types for React Navigation
 */
export type AuthStackParamList = {
  Login: undefined;
};

export type UpdaterState = {
  checked: boolean;
  acceptedUpdate: boolean;
  releaseData?: ReleaseJsonEntry;
};

/**
 * Main routing component. Manages login and access to {@link AuthStack} and {@link AppStack}.
 */
export default function Router() {
  const {t} = useTranslation();
  const {setModal} = useContext(ModalContext);
  const {dark} = useContext(DeviceContext);

  // Setup moment locale.
  // WARNING: Moment shouldn't be called by Router's parent components!
  // Reason: Initial load time will be slower for new users on web
  useEffect(() => {
    setMomentLocale(getLanguageCode());
  }, []);

  // Update checking-related stuff
  const [updaterState, setUpdaterState] = useState<UpdaterState>({
    checked: false,
    acceptedUpdate: false,
  });

  /**
   * Check for updates and cleanup
   */
  useEffect(() => {
    if (!updaterState.checked) {
      checkForUpdates().then(data =>
        setUpdaterState(prev => ({...prev, releaseData: data, checked: true})),
      );
    }
    updateCleanup();
  }, [updaterState.checked]);

  // Show modal if update available
  useEffect(() => {
    if (updaterState.releaseData) {
      const locale = getLocales()[0].languageCode;
      let notes = updaterState.releaseData.notes.find(
        n => n.language === locale,
      );

      setModal(
        <BaseActionConfirmModal
          title={t('newUpdateModalTitle')}
          icon="download"
          accentColor={'#2dba2a'}
          onConfirm={() =>
            setUpdaterState(prev => ({
              ...prev,
              acceptedUpdate: true,
            }))
          }>
          <Text s={12 * p} w="m" c={dark ? colors.gray100 : colors.gray800}>
            {t('newUpdateModalText') + '\n\n' + t('newUpdateModalNotes') + '\n'}
          </Text>
          {updaterState.releaseData.format === 'text'
            ? (notes?.content || []).map(note => (
                <Text
                  s={12 * p}
                  w="r"
                  c={dark ? colors.gray100 : colors.gray800}>
                  {`  • ${note}`}
                </Text>
              ))
            : (notes?.content || []).map(note => (
                <RenderHTMLSource source={{html: note}} />
              ))}
        </BaseActionConfirmModal>,
      );
    }
  }, [updaterState.releaseData, dark, setModal, t]);

  const {authStatus} = useSelector<RootState, SessionState>(
    state => state.session,
  );

  // Logging-related stuff
  const {logging} = useSelector<RootState, Configuration>(
    state => state.session.config,
  );

  const [message, setMessage] = useState<ReactNode>(null);

  // If loggingEnabled changes, set whether to show top message
  useEffect(() => {
    logging
      ? setMessage(buildMessage({text: t('Logging enabled'), type: 'warn'}))
      : setMessage(null);
  }, [logging, t]);

  // Returns message component
  const buildMessage = ({text = '', type = 'warn'}) => {
    return (
      <View
        style={{
          backgroundColor: type == 'warn' ? colors.orange : colors.black,
          paddingVertical: 4,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Text s={10 * p} w="m" c={colors.white}>
          {text}
        </Text>
      </View>
    );
  };

  const children = useMemo(
    () => (
      <>
        {message}
        {updaterState.acceptedUpdate ? (
          <Updater releaseData={updaterState.releaseData!} />
        ) : authStatus !== AUTH_STATUS.NOT_VALID ? (
          <AppStackNavigator />
        ) : null}
      </>
    ),
    [authStatus, message, updaterState],
  );

  /**
   * If on web, {@link HTMLRenderEngineProvider} has not been created
   * in the parent App component. We need to insert it now.
   */
  return genericPlatform === 'web' ? (
    <HTMLRenderEngineProvider>{children}</HTMLRenderEngineProvider>
  ) : (
    children
  );
}

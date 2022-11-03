import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {View} from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import colors from '../colors';
import {useTranslation} from 'react-i18next';

import {useSelector, useDispatch} from 'react-redux';
import {SessionState, setConfig, setConfigState} from '../store/sessionSlice';
import HomeRouter from './HomeRouter';
import Search from '../screens/Search';
import Course from '../screens/Course';
import Video from '../screens/Video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultConfig, {
  Configuration,
  CONFIG_SCHEMA_VERSION,
} from '../defaultConfig';
import {AUTH_STATUS} from '../store/status';
import {AppDispatch, RootState} from '../store/store';
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
import Updater from '../screens/Updater';
import {RenderHTMLSource} from 'react-native-render-html';

/**
 * Types for React Navigation
 */
export type AuthStackParamList = {
  Login: undefined;
};

export type AppStackParamList = {
  HomeRouter: undefined;
  Search: undefined;
  Course: undefined;
  Video: undefined;
};

export type UpdaterState = {
  checked: boolean;
  acceptedUpdate: boolean;
  releaseData?: ReleaseJsonEntry;
};

/**
 * Stack navigators
 */
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

/**
 * Main routing component. Manages login and access to {@link AuthStack} and {@link AppStack}.
 */
export default function Router() {
  const {t} = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const {setModal} = useContext(ModalContext);
  const {dark} = useContext(DeviceContext);

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
  const [message, setMessage] = useState(<View></View>);

  const [setupDone, setSetupDone] = useState(false);
  // Initial setup
  useEffect(() => {
    (async () => {
      // Set config in store
      let loadedConfig = (JSON.parse(
        (await AsyncStorage.getItem('@config')) || '{}',
      ) || defaultConfig) as Configuration;

      /**
       * Check for old schema and/or new default settings items.
       */
      if (
        !loadedConfig.schemaVersion ||
        loadedConfig.schemaVersion !== CONFIG_SCHEMA_VERSION
      ) {
        const currentSettingsKeys = Object.keys(loadedConfig);
        const defaultSettingsKeys = Object.keys(defaultConfig);

        // Delete settings that have been deleted in default config
        const toDelete = currentSettingsKeys.filter(
          k => !defaultSettingsKeys.includes(k),
        );
        toDelete.forEach(k => delete (loadedConfig as any)[k]);

        // Add missing new settings with their default value
        dispatch(
          setConfig({
            ...loadedConfig,
            ...defaultConfig,
          }),
        );
      } else {
        dispatch(setConfigState(loadedConfig));
      }

      // Setup complete
      setSetupDone(true);
    })();

    return () => {
      // Cleanup
    };
  }, []);

  // If loggingEnabled changes, set whether to show top message
  useEffect(() => {
    logging
      ? setMessage(buildMessage({text: t('Logging enabled'), type: 'warn'}))
      : setMessage(<View></View>);
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

  if (!setupDone) {
    return null;
  }

  if (updaterState.acceptedUpdate) {
    return <Updater releaseData={updaterState.releaseData!} />;
  }

  if (authStatus !== AUTH_STATUS.NOT_VALID) {
    return (
      <NavigationContainer>
        <AppStack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <AppStack.Screen name="HomeRouter" component={HomeRouter} />
          <AppStack.Screen name="Search" component={Search} />
          <AppStack.Screen name="Course" component={Course} />
          <AppStack.Screen name="Video" component={Video} />
        </AppStack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <AuthStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <AuthStack.Screen name="Login" component={LoginScreen} />
      </AuthStack.Navigator>
    </NavigationContainer>
  );
}

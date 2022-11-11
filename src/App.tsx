import React, {Suspense, useEffect, useState} from 'react';
import {Provider, useDispatch, useSelector} from 'react-redux';
import store, {AppDispatch, RootState} from './store/store';
import Fallback from './ui/Fallback';
import {initI18n, languageChangeEventHandler} from './utils/l10n';
import {addEventListener, removeEventListener} from 'react-native-localize';
import DeviceProvider from './context/Device';
import {ModalProvivder} from './context/ModalProvider';
import {Device} from 'open-polito-api/lib/device';
import Toast from './ui/Toast';
import ModalComponent from './components/modals/ModalComponent';
import {SessionState, setConfig, setConfigState} from './store/sessionSlice';
import LoginScreen from './screens/LoginScreen';
import {genericPlatform} from './utils/platform';
import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultConfig, {
  Configuration,
  CONFIG_SCHEMA_VERSION,
} from './defaultConfig';

// Device instance to pass to Context API for global use
const defaultDevice = new Device('', 10000, () => {});

const Router = React.lazy(() => import('./routes/Router'));

const HTMLRenderEngineProvider = React.lazy(
  () => import('./context/HTMLRenderEngineProvider'),
);

/**
 * Initialize i18n
 */
initI18n();

/**
 * Has access to all providers defined in {@link App}
 */
const InnerApp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {config} = useSelector<RootState, SessionState>(state => state.session);

  const [setupDone, setSetupDone] = useState(false);

  /**
   * Initial config setup
   */
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
  }, [dispatch]);

  if (!setupDone) {
    return null;
  }

  return (
    <>
      {config.login ? <Router /> : <LoginScreen />}
      <Toast />
      <ModalComponent />
    </>
  );
};

const App = () => {
  useEffect(() => {
    addEventListener('change', languageChangeEventHandler);
    return () => {
      removeEventListener('change', languageChangeEventHandler);
    };
  }, []);

  /**
   * If on web, {@link HTMLRenderEngineProvider} will be provided in the Route
   * component, to save initial loading time.
   */
  return (
    <Suspense fallback={<Fallback />}>
      <Provider store={store}>
        <DeviceProvider device={defaultDevice}>
          <ModalProvivder>
            {genericPlatform === 'web' ? (
              <InnerApp />
            ) : (
              <HTMLRenderEngineProvider>
                <InnerApp />
              </HTMLRenderEngineProvider>
            )}
          </ModalProvivder>
        </DeviceProvider>
      </Provider>
    </Suspense>
  );
};

export default App;

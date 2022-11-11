import {Device} from 'open-polito-api/lib/device';
import React, {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ColorSchemeName,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import {useSelector} from 'react-redux';
import {Configuration} from '../defaultConfig';
import {RootState} from '../store/store';
import {DeviceSize} from '../types';
import {createDevice} from '../utils/api-utils';

const getLogger = () => import('../utils/Logger');

export type DeviceProviderProps = {
  chosenTheme: string;

  device: Device;
  setDevice: React.Dispatch<React.SetStateAction<Device>>;

  colorScheme: ColorSchemeName;
  dark: boolean;
  size: DeviceSize;
};

export type DeviceProviderFunctionProps = {
  chosenTheme: string;
  colorScheme: ColorSchemeName;

  children: ReactNode;
  device: Device;
};

export const DeviceContext = createContext<DeviceProviderProps>({
  chosenTheme: 'system',

  device: createDevice('', ''),
  setDevice: () => {},

  colorScheme: 'dark',
  dark: true,

  size: DeviceSize.normal,
});

/**
 * Returns a component with a {@link Device} instance provider.
 * Wraps all app components that need access to the Device instance.
 * @param param0 {@link DeviceProviderFunctionProps} object
 * @returns
 */
const DeviceProvider = ({
  children,
  device,
}: {
  children: ReactNode;
  device: Device;
}) => {
  const [_device, _setDevice] = useState(device);

  const config = useSelector<RootState, Configuration>(
    state => state.session.config,
  );

  /**
   * Set request logger when config or device change
   */
  useEffect(() => {
    if (config.logging) {
      getLogger().then(({default: Logger}) => {
        device.request_logger = Logger.logRequestSync;
      });
    } else {
      device.request_logger = () => {};
    }
  }, [config, device]);

  const {width} = useWindowDimensions();

  const _colorScheme = useColorScheme();
  const _dark = useMemo<boolean>(() => {
    return config.theme === 'system'
      ? _colorScheme === 'dark'
      : config.theme === 'dark';
  }, [config.theme, _colorScheme]);
  const size = useMemo<DeviceSize>(
    () => (width >= 1000 ? DeviceSize.lg : DeviceSize.normal),
    [width],
  );

  return (
    <DeviceContext.Provider
      value={{
        device: _device,
        setDevice: d => {
          _setDevice(d);
        },

        chosenTheme: config.theme,
        colorScheme: _colorScheme,
        dark: _dark,
        size,
      }}>
      {children}
    </DeviceContext.Provider>
  );
};

export default DeviceProvider;

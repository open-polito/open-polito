import {Device} from 'open-polito-api/device';
import React, {createContext, ReactNode, useMemo, useState} from 'react';
import {ColorSchemeName, useColorScheme} from 'react-native';
import {useSelector} from 'react-redux';
import {Configuration} from '../defaultConfig';
import {RootState} from '../store/store';
import {createDevice} from '../utils/api-utils';

export type DeviceProviderProps = {
  chosenTheme: string;

  device: Device;
  setDevice: React.Dispatch<React.SetStateAction<Device>>;

  colorScheme: ColorSchemeName;
  dark: boolean;
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
  // Overrides
  const [_device, _setDevice] = useState(device);
  const sel = useSelector<RootState, Configuration>(
    state => state.session.config,
  );
  const _chosenTheme = useSelector<RootState, string>(
    state => state.session.config.theme,
  );
  const _colorScheme = useColorScheme();
  const _dark = useMemo<boolean>(() => {
    return _chosenTheme == 'system'
      ? _colorScheme == 'dark'
      : _chosenTheme == 'dark';
  }, [_chosenTheme, _colorScheme]);

  return (
    <DeviceContext.Provider
      value={{
        device: _device,
        setDevice: device => {
          _setDevice(device);
        },

        chosenTheme: _chosenTheme,
        colorScheme: _colorScheme,
        dark: _dark,
      }}>
      {children}
    </DeviceContext.Provider>
  );
};

export default DeviceProvider;

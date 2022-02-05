import {Device} from 'open-polito-api';
import React, {createContext, FC, ReactNode, useEffect, useState} from 'react';
import {createDevice} from '../utils/api-utils';

export type DeviceProviderProps = {
  device: Device;
  setDevice: React.Dispatch<React.SetStateAction<Device>>;
};

export type DeviceProviderFunctionProps = {
  children: ReactNode;
  device: Device;
};

export const DeviceContext = createContext<DeviceProviderProps>({
  device: createDevice('', ''),
  setDevice: () => {},
});

/**
 * Returns a component with a {@link Device} instance provider.
 * Wraps all app components that need access to the Device instance.
 * @param param0 {@link DeviceProviderFunctionProps} object
 * @returns
 */
const DeviceProvider = ({children, device}: DeviceProviderFunctionProps) => {
  const [_device, _setDevice] = useState(device);

  return (
    <DeviceContext.Provider
      value={{
        device: _device,
        setDevice: device => {
          _setDevice(device);
        },
      }}>
      {children}
    </DeviceContext.Provider>
  );
};

export default DeviceProvider;

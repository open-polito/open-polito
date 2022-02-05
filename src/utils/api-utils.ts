/**
 * @file Functions to simplify interaction with open-polito-api
 */

import { Device } from 'open-polito-api';
import { DeviceData } from 'open-polito-api/device';
import User, { Anagrafica } from 'open-polito-api/user';
import { Platform } from 'react-native';

/**
 * Abstracts creation of Device instance
 * @param uuid The device's UUID
 * @param token Access tokem
 * @returns Device
 */
export function createDevice(uuid: string, token?: string): Device {
  const dev = new Device(uuid, 10000);
  if (token) dev.token = token;
  return dev;
}

/**
 * Returns device data that is sent to PoliTo servers during first login
 * @returns DeviceData object
 */
export function getDeviceData(): DeviceData {
  return {
    platform: Platform.OS,
    version: Platform.Version + '',
    model: 'Generic',
    manufacturer: 'Unknown',
  };
}

/**
 * Abstracts creation of User instance
 * @param device Device instance
 * @param anagrafica Anagrafica object
 * @returns User
 */
export function createUser(device: Device, anagrafica: Anagrafica) {
  return new User(device, anagrafica);
}

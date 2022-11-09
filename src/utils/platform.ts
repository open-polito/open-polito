import Constants from 'expo-constants';

/**
 * Generic platform identifier.
 * This is not the OS.
 */
export type PlatformIdentifier = 'mobile' | 'web' | 'desktop';

export const osFilters = [
  'android',
  'win',
  'macos',
  'os x',
  'linux',
  'ubuntu',
  'debian',
  'fedora',
  'suse',
] as const;

export type OSIdentifier = typeof osFilters[number] | undefined;

/**
 * Current generic platform (not the OS).
 */
export const genericPlatform: PlatformIdentifier =
  (Constants.expoConfig?.extra?.platform as PlatformIdentifier) || 'mobile';

export const platform =
  genericPlatform === 'web'
    ? import('platform').then(res => res.default).catch()
    : undefined;

export type Platform = Awaited<typeof platform>;

/**
 * Gets current OS generic name
 */
export const getOSIdentifier = async () => {
  const p = await platform;
  for (const os of osFilters) {
    if (p?.os?.family?.toLowerCase().includes(os)) {
      return os;
    }
  }
};

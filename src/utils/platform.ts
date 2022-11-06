import Constants from 'expo-constants';

/**
 * Generic platform identifier.
 * This is not the OS.
 */
export type PlatformIdentifier = 'mobile' | 'web' | 'desktop';

/**
 * Returns the current generic platform (not the OS).
 */
export const getPlatform = (): PlatformIdentifier => {
  return (
    (Constants.expoConfig?.extra?.platform as PlatformIdentifier) || 'mobile'
  );
};

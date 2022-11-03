import {Platform} from 'react-native';

/**
 * Get scaling factor for current device
 *
 * TODO compute for different screen sizes
 * @returns scaling factor
 */
export const getScalingFactor = () => {
  if (Platform.OS === 'web') {
    return 1.25;
  }
  return 1.15;
};

export const p = getScalingFactor();

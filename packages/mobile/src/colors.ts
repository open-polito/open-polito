export type Color = string;

const colors = {
  // Legacy palette
  // TODO delete when UI transition complete
  gradient1: '#253efc',
  gradient2: '#4625fc',
  black: '#000',
  white: '#fff',
  background: '#FDFDFD',
  gray: '#777',
  mediumGray: '#aaa',
  lightGray: '#eee',
  orange: '#ffa500',

  // Accent colors
  accent50: '#F0F5FF',
  accent100: '#D3E2FF',
  accent200: '#95B9FF',
  accent300: '#538DFF',

  // Gray colors
  gray50: '#F5F6F8',
  gray100: '#DFE2E8',
  gray200: '#B0B6C4',
  gray300: '#878F9F',
  gray400: '#626A79',
  gray500: '#434B5A',
  gray600: '#29303F',
  gray700: '#1B1E25',
  gray800: '#0E0E10',
  gray900: '#010102',

  // Other colors
  red: '#FF3F3F',
  green: '#6FCF97',
};

const courseColors = ['#0E13B0', '#C2272C', '#E09326', '#6903AD', '#1E91D6'];

export default colors;
export {courseColors};

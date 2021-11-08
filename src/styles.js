import {StyleSheet} from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
  // Text color varieties
  blackText: {
    color: colors.black,
  },
  whiteText: {
    color: colors.white,
  },
  grayText: {
    color: colors.gray,
  },
  // Text font weights
  textRegular: {
    fontFamily: 'Montserrat-Regular',
  },
  textMedium: {
    fontFamily: 'Montserrat-Medium',
  },
  textBold: {
    fontFamily: 'Montserrat-Bold',
  },
  // Text sizes
  textSmall: {
    fontSize: 12,
  },
  textNormal: {
    fontSize: 16,
  },
  textLarge: {
    fontSize: 24,
  },
  textExtraLarge: {
    fontSize: 42,
  },

  // General styles
  withHorizontalPadding: {
    paddingHorizontal: 24,
  },
  withRoundedBorder: {
    borderRadius: 4,
  },
});

export default styles;

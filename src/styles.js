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
  textMediumSize: {
    fontSize: 20,
  },
  textLarge: {
    fontSize: 24,
  },
  textExtraLarge: {
    fontSize: 32,
  },
  textTitleLarge: {
    fontSize: 42,
  },

  // General styles
  withHorizontalPadding: {
    paddingHorizontal: 24,
  },
  withRoundedBorder: {
    borderRadius: 4,
  },
  safePaddingTop: {
    paddingTop: 40,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'space-between',
  },
  paddingFromHeader: {
    paddingTop: 32,
  },
  titleBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabNavigator: {
    backgroundColor: colors.white,
    height: 60,
    tabBarActiveTintColor: colors.white,
    paddingBottom: 8,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  elevatedSmooth: {
    shadowColor: '#aaa',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
});

export default styles;

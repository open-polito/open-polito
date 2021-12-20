import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import colors from '../colors';
import {TextN, TextS} from './Text';
import {useTranslation} from 'react-i18next';

import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles';

export default function AccountBox({name, degree, logoutFunction}) {
  const {t} = useTranslation();
  return (
    <View style={_styles.box}>
      <View style={_styles.infoContainer}>
        <View style={_styles.infoPicContainer}>
          <View style={_styles.profilePic}>
            <Icon name="account-box" color={colors.white} size={38} />
          </View>
        </View>
        <View style={_styles.infoTextContainer}>
          <TextN text={name} weight="regular" />
          <TextS text={degree} />
        </View>
      </View>
      <View style={_styles.logoutBtnContainer}>
        <Pressable android_ripple={{color: '#ccc'}} onPress={logoutFunction}>
          <View style={_styles.logoutBtn}>
            <TextN text={t('logout')} weight="medium" />
            <Icon
              name="logout"
              style={{marginLeft: 6}}
              size={24}
              color={colors.black}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const _styles = StyleSheet.create({
  box: {
    borderRadius: 8,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.white,
    ...styles.elevatedSmooth,
    marginHorizontal: styles.withHorizontalPadding.paddingHorizontal,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  infoPicContainer: {
    marginRight: 12,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.gradient1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTextContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  logoutBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignItems: 'center',
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 6,
    padding: 4,
  },
});

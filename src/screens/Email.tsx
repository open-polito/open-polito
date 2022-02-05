import React, {useContext, useEffect, useState} from 'react';
import {Linking, Pressable, StatusBar, View} from 'react-native';
import {useSelector} from 'react-redux';
import colors from '../colors';
import Header from '../components/Header';
import {TextS} from '../components/Text';
import styles from '../styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import ScreenContainer from '../components/ScreenContainer';
import {DeviceContext} from '../context/Device';
import {createUser} from '../utils/api-utils';
import {RootState} from '../store/store';
import {Anagrafica} from 'open-polito-api/user';

export default function Email() {
  const {t} = useTranslation();

  const deviceContext = useContext(DeviceContext);

  const userInfo = useSelector<RootState, Anagrafica | null>(
    state => state.user.userInfo,
  );
  const unreadEmailCount = useSelector<RootState, number>(
    state => state.user.unreadEmailCount,
  );

  const openWebMail = async () => {
    const url = await createUser(deviceContext.device, userInfo!).emailUrl();
    Linking.openURL(url);
  };

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
  });
  return (
    <ScreenContainer>
      <Header text={t('email')} noMarginBottom={true} />
      <View
        style={{
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: -styles.textExtraLarge.fontSize,
        }}>
        <TextS
          text={t('unreadEmail', {count: unreadEmailCount})}
          weight="bold"
        />
        <TextS text={t('noEmailAccess')} />
        <Pressable
          android_ripple={{color: '#ccc'}}
          style={{marginTop: 16}}
          onPress={openWebMail}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 16,
              borderWidth: 2,
              borderColor: colors.gray,
              borderStyle: 'dashed',
            }}>
            <Icon name="open-in-new" size={48} color={colors.gray} />
            <TextS text={t('openBrowser')} color={colors.gray} weight="bold" />
          </View>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

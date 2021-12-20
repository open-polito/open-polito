import React, {useEffect} from 'react';
import {Linking, Pressable, StatusBar, View} from 'react-native';
import {useSelector} from 'react-redux';
import colors from '../colors';
import Header from '../components/Header';
import {TextS} from '../components/Text';
import styles from '../styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {emailUrlGenerator} from '../utils/uri_assembler';
import {useTranslation} from 'react-i18next';
import ScreenContainer from '../components/ScreenContainer';

export default function Email() {
  const {t} = useTranslation();

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
  });

  const {uuid, token} = useSelector(state => state.session);
  const {unreadEmailCount} = useSelector(state => state.email);

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
          onPress={async () => {
            const url = await emailUrlGenerator(uuid, token);
            Linking.openURL(url);
          }}>
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

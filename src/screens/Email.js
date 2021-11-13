import React, {useEffect} from 'react';
import {Linking, Pressable, SafeAreaView, StatusBar, View} from 'react-native';
import {useSelector} from 'react-redux';
import colors from '../colors';
import Header from '../components/Header';
import {TextS} from '../components/Text';
import styles from '../styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {emailUrlGenerator} from '../utils/uri_assembler';

export default function Email() {
  const {windowHeight} = useSelector(state => state.ui);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
  });

  const {uuid, token} = useSelector(state => state.session);
  const {unreadEmailCount} = useSelector(state => state.email);

  return (
    <SafeAreaView style={{height: windowHeight - styles.tabNavigator.height}}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View
        style={{
          ...styles.container,
          ...styles.safePaddingTop,
          ...styles.withHorizontalPadding,
          backgroundColor: colors.white,
          height: windowHeight,
        }}>
        <Header text="E-mail" noMarginBottom={true} />
        <View
          style={{
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop:
              -styles.titleBar.marginBottom - styles.textExtraLarge.fontSize,
          }}>
          <TextS text={`${unreadEmailCount} unread e-mails`} weight="bold" />
          <TextS text="E-mail access is not possible yet." />
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
              <TextS
                text="Tap to open in browser"
                color={colors.gray}
                weight="bold"
              />
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

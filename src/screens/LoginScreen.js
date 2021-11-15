import React, {useEffect, useState} from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  Keyboard,
  Dimensions,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../colors';
import Button from '../components/Button';
import {Text, TextTitle, TextSubTitle, TextAction} from '../components/Text';
import TextInput from '../components/TextInput';
import styles from '../styles';
import {useTranslation} from 'react-i18next';

export default function LoginScreen(props) {
  const {t} = useTranslation();
  const [isKbdVisible, setIsKbdVisible] = useState('');
  const [height, setHeight] = useState(
    Dimensions.get('window').height + StatusBar.currentHeight,
  );

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <LinearGradient
      colors={[colors.gradient1, colors.gradient2]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      height={height}>
      <ImageBackground source={require('../../assets/images/background.png')}>
        <SafeAreaView style={_styles.splash}>
          <StatusBar translucent backgroundColor="transparent" />
          <View style={styles.container}>
            <View style={{...styles.withHorizontalPadding, ..._styles.intro}}>
              <TextTitle text="Open PoliTo" color="white" weight="bold" />
              <TextSubTitle
                text={t('caption')}
                color="white"
                style={{marginTop: 20}}
              />
            </View>
            <View
              style={{...styles.withHorizontalPadding, ..._styles.loginCard}}>
              <TextAction text={t('loginCall')} />
              <TextInput
                textContentType="emailAddress"
                placeholder={t('userPlaceholder')}
                icon="account-circle"
                onChangeText={txt => {
                  setUsername(txt);
                }}
              />
              <TextInput
                textContentType="password"
                placeholder={t('passwordPlaceholder')}
                icon="lock-outline"
                secureTextEntry={true}
                onChangeText={txt => {
                  setPassword(txt);
                }}
              />
              <Button
                text={t('login')}
                onPress={() => {
                  props.loginFunction(username, password);
                }}
              />
            </View>
            <View style={_styles.versionView}>
              <Text
                text={`${t('version')} 0.2.0`}
                color="white"
                style={{
                  marginHorizontal: 'auto',
                  position: 'absolute',
                  textAlign: 'center',
                  width: '100%',
                  bottom: 24,
                }}
              />
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </LinearGradient>
  );
}

const _styles = StyleSheet.create({
  splash: {
    height: '100%',
  },
  intro: {
    paddingTop: '15%',
    flex: 1,
  },
  versionView: {
    position: 'relative',
    flex: 1,
  },
  loginCard: {
    flexBasis: 1.5,
    flexGrow: 1.75,
    flexShrink: 1.25,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: colors.white,
    paddingVertical: 24,
    elevation: 8,
  },
});

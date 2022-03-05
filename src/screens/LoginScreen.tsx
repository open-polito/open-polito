import 'react-native-get-random-values';
import React, {useContext, useState} from 'react';
import {View, StatusBar, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../colors';
import Button from '../components/Button';
import {Text, TextSubTitle, TextTitle, TextXL} from '../components/Text';
import TextInput from '../components/TextInput';
import styles from '../styles';
import {useTranslation} from 'react-i18next';
import {login, LoginData} from '../store/sessionSlice';
import {v4 as UUIDv4} from 'uuid';
import {useDispatch} from 'react-redux';
import {DeviceContext} from '../context/Device';
import {getLoggingConfig, requestLogger} from '../routes/Router';
import {Device} from 'open-polito-api/device';

export default function LoginScreen() {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const deviceContext = useContext(DeviceContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  /**
   * Login with password
   *
   * @param loginData {@link LoginData} object
   */
  const loginWithPassword = async (loginData: LoginData) => {
    const uuid = UUIDv4();

    const loggingEnabled = await getLoggingConfig();

    const device = new Device(
      uuid,
      10000,
      loggingEnabled ? requestLogger : () => {},
    );

    // Set device instance
    deviceContext.setDevice(device);

    await dispatch(
      login({
        method: 'password',
        username: loginData.user,
        token: loginData.token,
        device: device,
      }),
    );
  };

  return (
    <View style={{flex: 1}}>
      <LinearGradient
        colors={[colors.gradient1, colors.gradient2]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={{flex: 1}}>
        <SafeAreaView style={_styles.splash}>
          <StatusBar translucent backgroundColor="transparent" />
          <View style={{...styles.container, flex: 1, flexDirection: 'column'}}>
            <View style={{...styles.withHorizontalPadding, ..._styles.intro}}>
              <TextTitle text={t('appName')} color="white" weight="bold" />
              <TextSubTitle
                text={t('caption')}
                color="white"
                style={{marginTop: 20}}
              />
            </View>
            <View
              style={{
                ...styles.withHorizontalPadding,
                ..._styles.loginCard,
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}>
                <TextXL
                  style={{marginVertical: 32}}
                  text={t('loginCall')}
                  weight="bold"
                />
                <TextInput
                  spaced
                  textContentType="username"
                  autoComplete="username"
                  placeholder={t('userPlaceholder')}
                  icon="account-circle"
                  onChangeText={txt => {
                    setUsername(txt);
                  }}
                />
                <TextInput
                  spaced
                  textContentType="password"
                  autoComplete="password"
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
                    loginWithPassword({user: username, token: password});
                  }}
                />
              </View>
              <View style={_styles.versionView}>
                <Text
                  text={`${t('version')} 0.5.0-alpha.1`}
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
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
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
    flexDirection: 'column',
    flex: 2.5,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    ...styles.elevatedSmooth,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
});

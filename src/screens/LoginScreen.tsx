import React, {useState, useContext, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {DeviceContext} from '../context/Device';
import {LoginData, login} from '../store/sessionSlice';
import {v4 as UUIDv4} from 'uuid';
import {getLoggingConfig} from '../routes/Router';
import {Device} from 'open-polito-api/device';
import {requestLogger} from '../routes/Router';
import Screen from '../ui/Screen';
import {Dimensions, StyleSheet, View} from 'react-native';
import Text from '../ui/core/Text';
import colors from '../colors';
import i18next from 'i18next';
import TablerIcon from '../ui/core/TablerIcon';
import TextInput from '../ui/core/TextInput';
import Button from '../ui/core/Button';

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

  const fields = useMemo(() => {
    return [
      ['brand-open-source', t('title1'), t('desc1')],
      ['bolt', t('title2'), t('desc2')],
      ['apps', t('title3'), t('desc3')],
    ];
  }, []);

  const _styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flex: 1,
        marginTop: 80,
        paddingHorizontal: 16,
        paddingBottom: 16,
      },
      field: {
        flexDirection: 'row',
        marginBottom: 16,
      },
      fieldText: {
        marginLeft: 16,
        width: '85%',
      },
      loginSection: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
      },
      or: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
      },
      line: {
        flex: 1,
        height: 1,
        backgroundColor: deviceContext.dark ? colors.gray100 : colors.gray800,
      },
      orText: {
        marginHorizontal: 8,
      },
    });
  }, [deviceContext.dark]);

  return (
    <Screen>
      {/* TODO SVG background */}
      <View style={_styles.container}>
        <Text
          c={deviceContext.dark ? colors.gray100 : colors.gray800}
          w="b"
          s={24}
          style={{marginBottom: 16}}>
          Welcome to {'\n'}Open PoliTo
        </Text>
        <Text
          c={deviceContext.dark ? colors.gray200 : colors.gray700}
          w="m"
          s={16}>
          {t('caption')}
        </Text>
        <View style={{marginTop: 48}}>
          {fields.map(part => (
            <View style={_styles.field}>
              <TablerIcon name={part[0]} color={colors.accent300} />
              <View style={_styles.fieldText}>
                <Text
                  s={12}
                  c={deviceContext.dark ? colors.gray100 : colors.gray800}
                  w="b"
                  style={{marginBottom: 4}}>
                  {part[1]}
                </Text>
                <Text
                  s={12}
                  c={deviceContext.dark ? colors.gray200 : colors.gray700}
                  w="m">
                  {part[2]}
                </Text>
              </View>
            </View>
          ))}
        </View>
        <View style={_styles.loginSection}>
          <TextInput
            dark={deviceContext.dark}
            textContentType="emailAddress"
            icon="user-circle"
            placeholder={t('userPlaceholder')}
            style={{
              marginBottom: 16,
            }}
          />
          <TextInput
            dark={deviceContext.dark}
            textContentType="password"
            secureTextEntry={true}
            icon="lock"
            placeholder={t('passwordPlaceholder')}
            style={{
              marginBottom: 16,
            }}
          />
          <Button text={t('login')} style={{marginBottom: 16}} />
          <View style={_styles.or}>
            <View style={_styles.line} />
            <Text
              w="r"
              s={10}
              c={deviceContext.dark ? colors.gray100 : colors.gray800}
              style={_styles.orText}>
              {t('or').toUpperCase()}
            </Text>
            <View style={_styles.line} />
          </View>
          <Button text={t('takeTour')} secondary />
          {/*
          TODO enable when ToS defined
          */}
          {/* <Text
            w="r"
            s={10}
            c={deviceContext.dark ? colors.gray100 : colors.gray800}
            style={{textAlign: 'center', marginTop: 32}}>
            {t('agreement') + ' '}
            <Text href="https://example.com/" w="r" s={10} c={colors.accent300}>
              {t('tos')}
            </Text>
            {' e '}
            <Text href="https://example.com/" w="r" s={10} c={colors.accent300}>
              {t('privacyPolicy')}
            </Text>
          </Text> */}
        </View>
      </View>
    </Screen>
  );
}

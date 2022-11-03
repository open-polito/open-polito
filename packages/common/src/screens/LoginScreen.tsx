import React, {useState, useContext, useMemo, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {DeviceContext} from '../context/Device';
import {login, setToast} from '../store/sessionSlice';
import 'react-native-get-random-values';
import Screen from '../ui/Screen';
import {StyleSheet, View} from 'react-native';
import Text from '../ui/core/Text';
import colors from '../colors';
import TextInput from '../ui/core/TextInput';
import Button from '../ui/core/Button';
import {p} from '../scaling';
import {STATUS, Status} from '../store/status';
import {AppDispatch, RootState} from '../store/store';
import {LoginValidationResult, validateLoginInput} from '../utils/auth';

export default function LoginScreen() {
  const {t} = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const loginStatus = useSelector<RootState, Status>(
    state => state.session.loginStatus,
  );

  const deviceContext = useContext(DeviceContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  /**
   * Login with password
   */
  const loginWithPassword = async () => {
    /**
     * Validate fields
     */

    const validationResult = validateLoginInput(username, password);

    switch (validationResult) {
      case LoginValidationResult.OK:
        break;
      case LoginValidationResult.NO_USER:
        dispatch(
          setToast({
            message: t('noUsernameProvided'),
            type: 'err',
            visible: true,
          }),
        );
        return;
      case LoginValidationResult.NO_PASSWORD:
        dispatch(
          setToast({
            message: t('noPasswordProvided'),
            type: 'err',
            visible: true,
          }),
        );
        return;
      case LoginValidationResult.INVALID_USERNAME:
        dispatch(
          setToast({
            message: t('invalidUsernameProvided'),
            type: 'err',
            visible: true,
          }),
        );
        return;
    }

    /**
     * Actually login
     */

    await dispatch(
      login({
        method: 'password',
        username: username,
        password: password,
        device: deviceContext.device,
      }),
    );
  };

  // const fields = [
  //   ['brand-open-source', t('title1'), t('desc1')],
  //   ['bolt', t('title2'), t('desc2')],
  //   ['apps', t('title3'), t('desc3')],
  // ];

  /**
   * Show toast notification based on login result
   */
  // useEffect(() => {
  //   if (loginStatus.code === STATUS.ERROR) {
  //     dispatch(
  //       setToast({
  //         type: 'err',
  //         message: loginStatus.error?.message ?? '',
  //         visible: true,
  //         icon: '',
  //       }),
  //     );
  //   }
  // }, []);

  const _styles = useMemo(() => {
    return StyleSheet.create({
      backgroundContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
      },
      container: {
        flex: 1,
        marginTop: 80 * p,
        paddingHorizontal: 16 * p,
        paddingBottom: 16 * p,
      },
      field: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16 * p,
      },
      fieldText: {
        marginLeft: 16 * p,
        width: '85%',
      },
      loginSection: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
      },
      or: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16 * p,
      },
      line: {
        flex: 1,
        height: 1,
        backgroundColor: deviceContext.dark ? colors.gray100 : colors.gray800,
      },
      orText: {
        marginHorizontal: 8 * p,
      },
    });
  }, [deviceContext.dark]);

  return (
    <Screen>
      <View style={_styles.backgroundContainer} />
      <View style={_styles.container}>
        <Text
          c={deviceContext.dark ? colors.gray100 : colors.gray800}
          w="b"
          s={24 * p}
          style={{marginBottom: 16 * p}}>
          Welcome to {'\n'}Open PoliTo
        </Text>
        <Text
          c={deviceContext.dark ? colors.gray200 : colors.gray700}
          w="m"
          s={16 * p}>
          {t('caption')}
        </Text>
        {/* <View style={{marginTop: 48 * p}}>
          {fields.map(part => (
            <View style={_styles.field}>
              <TablerIcon name={part[0]} color={colors.accent300} />
              <View style={_styles.fieldText}>
                <Text
                  s={12 * p}
                  c={deviceContext.dark ? colors.gray100 : colors.gray800}
                  w="b"
                  style={{marginBottom: 4 * p}}>
                  {part[1]}
                </Text>
                <Text
                  s={12 * p}
                  c={deviceContext.dark ? colors.gray200 : colors.gray700}
                  w="m">
                  {part[2]}
                </Text>
              </View>
            </View>
          ))}
        </View> */}
        <View style={_styles.loginSection}>
          {/* TODO proper behavior when keyboard shows up */}
          <TextInput
            dark={deviceContext.dark}
            textContentType="emailAddress"
            icon="user-circle"
            placeholder={t('userPlaceholder')}
            style={{
              marginBottom: 16 * p,
            }}
            onChangeText={text => {
              setUsername(text);
            }}
          />
          <TextInput
            dark={deviceContext.dark}
            textContentType="password"
            secureTextEntry={true}
            icon="lock"
            placeholder={t('passwordPlaceholder')}
            style={{
              marginBottom: 16 * p,
            }}
            onChangeText={passwd => {
              setPassword(passwd);
            }}
          />
          <Button
            loading={loginStatus.code === STATUS.PENDING}
            text={t('login')}
            style={{marginBottom: 16 * p}}
            onPress={() => {
              loginWithPassword();
            }}
          />
          {/* <View style={_styles.or}>
            <View style={_styles.line} />
            <Text
              w="r"
              s={10 * p}
              c={deviceContext.dark ? colors.gray100 : colors.gray800}
              style={_styles.orText}>
              {t('or').toUpperCase()}
            </Text>
            <View style={_styles.line} />
          </View>
          <Button text={t('takeTour')} secondary /> */}
          {/*
          TODO enable when ToS defined
          */}
          {/* <Text
            w="r"
            s={10 * p}
            c={deviceContext.dark ? colors.gray100 : colors.gray800}
            style={{textAlign: 'center', marginTop: 16 * p}}>
            {t('agreement') + ' '}
            <Text
              href="https://example.com/"
              w="r"
              s={10 * p}
              c={colors.accent300}>
              {t('tos')}
            </Text>
            {' e '}
            <Text
              href="https://example.com/"
              w="r"
              s={10 * p}
              c={colors.accent300}>
              {t('privacyPolicy')}
            </Text>
          </Text> */}
        </View>
      </View>
    </Screen>
  );
}
import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StatusBar,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../colors';
import Header from '../components/Header';
import {TextL, TextN, TextS} from '../components/Text';
import styles from '../styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import ScreenContainer from '../components/ScreenContainer';
import {DeviceContext} from '../context/Device';
import {createUser} from '../utils/api-utils';
import {RootState} from '../store/store';
import {Anagrafica} from 'open-polito-api/user';
import WebView, {WebViewNavigation} from 'react-native-webview';
import {getUnreadEmailCount} from '../store/userSlice';
import {Configuration} from '../defaultConfig';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export default function Email() {
  const {t} = useTranslation();

  const deviceContext = useContext(DeviceContext);
  const dispatch = useDispatch();

  const userInfo = useSelector<RootState, Anagrafica | null>(
    state => state.user.userInfo,
  );
  const unreadEmailCount = useSelector<RootState, number>(
    state => state.user.unreadEmailCount,
  );
  const config = useSelector<RootState, Configuration>(
    state => state.session.config,
  );

  const [mounted, setMounted] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [webViewRef, setWebViewRef] = useState<WebView | null>(null);
  const [webMailUrl, setWebMailUrl] = useState('');

  const offset = useSharedValue(0.25);
  const animStyles = useAnimatedStyle(() => {
    return {
      flex: offset.value,
    };
  });

  useEffect(() => {
    (async () => {
      dispatch(
        getUnreadEmailCount(createUser(deviceContext.device, userInfo!)),
      );
      !webMailUrl && mounted && setWebMailUrl(await getWebMailUrl());
    })();
    return () => {
      setMounted(false);
    };
  }, []);

  const getWebMailUrl = async () => {
    const url = await createUser(deviceContext.device, userInfo!).emailUrl();
    return url;
  };

  const openWebMail = async () => {
    if (!mounted) return;
    let url = webMailUrl;
    !url && (url = await getWebMailUrl());
    setWebMailUrl(url);
    Linking.openURL(url);
  };

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
  }, []);

  const handleNavigationStateChange = (state: WebViewNavigation) => {
    if (!state.loading && !loaded) {
      setTimeout(() => {
        if (mounted) {
          setLoaded(true);
          offset.value = withTiming(1, {
            duration: 500,
            easing: Easing.out(Easing.exp),
          });
        }
      }, 1500);
    }
  };

  return (
    <ScreenContainer style={{paddingHorizontal: 0}}>
      <View style={styles.withHorizontalPadding}>
        <Header text={t('email')} noMarginBottom={true} />
      </View>

      {config.emailWebView ? (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
          <Animated.View
            style={[
              {
                margin: styles.withHorizontalPadding.paddingHorizontal,
                marginTop: styles.paddingFromHeader.paddingTop,
                ...styles.elevatedSmooth,
                backgroundColor: colors.white,
              },
              animStyles,
            ]}>
            {!loaded && (
              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.white,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TextN
                  text={t('loading')}
                  weight="medium"
                  style={{marginRight: 8}}
                />
                <ActivityIndicator color={colors.gradient1} size={24} />
              </View>
            )}
            <View
              style={{
                flex: loaded ? 1 : 0,
                backgroundColor: colors.white,
              }}>
              <WebView
                ref={ref => setWebViewRef(ref)}
                source={{uri: webMailUrl}}
                onNavigationStateChange={handleNavigationStateChange}
              />
            </View>
          </Animated.View>
        </View>
      ) : (
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
              <TextS
                text={t('openBrowser')}
                color={colors.gray}
                weight="bold"
              />
            </View>
          </Pressable>
        </View>
      )}
    </ScreenContainer>
  );
}

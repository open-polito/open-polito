import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useDispatch} from 'react-redux';
import colors from '../colors';
import {useTranslation} from 'react-i18next';
import {DeviceContext} from '../context/Device';
import {AppDispatch} from '../store/store';
import WebView, {WebViewNavigation} from 'react-native-webview';
import {getUnreadEmailCount} from '../store/userSlice';
import Animated from 'react-native-reanimated';
import {emailUrl} from 'open-polito-api/lib/user';
import Screen from '../ui/Screen';
import Header, {HEADER_TYPE} from '../ui/Header';
import {p} from '../scaling';
import Text from '../ui/core/Text';
import {genericPlatform} from '../utils/platform';
import {Device} from 'open-polito-api/lib/device';

// TODO dark mode in WebView

const getWebMailUrl = async (device: Device) => {
  const url = await emailUrl(device);
  return url;
};

export default function Email() {
  const {t} = useTranslation();

  const {dark, device} = useContext(DeviceContext);
  const dispatch = useDispatch<AppDispatch>();

  const [mounted, setMounted] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [webViewRef, setWebViewRef] = useState<WebView | null>(null);
  const [webMailUrl, setWebMailUrl] = useState('');

  useEffect(() => {
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    (async () => {
      dispatch(getUnreadEmailCount(device));
      !webMailUrl && mounted && setWebMailUrl(await getWebMailUrl(device));
      webMailUrl && genericPlatform !== 'mobile' && setLoaded(true);
    })();
  }, [device, dispatch, mounted, webMailUrl]);

  const handleNavigationStateChange = (state: WebViewNavigation) => {
    if (genericPlatform !== 'mobile') {
      return;
    }
    if (!state.loading && !loaded && mounted) {
      setLoaded(true);
    }
  };

  return (
    <Screen>
      <Header title={t('email')} headerType={HEADER_TYPE.MAIN} />
      <Animated.View style={{flex: 1}}>
        {loaded ? (
          genericPlatform !== 'mobile' ? (
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                s={12 * p}
                w="m"
                c={dark ? colors.gray100 : colors.gray800}
                style={{marginRight: 16 * p}}>
                {t('emailCannotBeShownDesktop')}
              </Text>
              <Text
                href={webMailUrl}
                s={12 * p}
                w="m"
                c={dark ? colors.gray100 : colors.gray800}
                style={{marginRight: 16 * p}}>
                {t('openBrowser')}
              </Text>
            </View>
          ) : null
        ) : (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              s={12 * p}
              w="m"
              c={dark ? colors.gray100 : colors.gray800}
              style={{marginRight: 16 * p}}>
              {t('loading')}
            </Text>
            <ActivityIndicator />
          </View>
        )}
        {genericPlatform === 'mobile' && (
          <View
            style={{
              flex: loaded ? 1 : 0,
            }}>
            <WebView
              ref={ref => !ref && setWebViewRef(ref)}
              source={{uri: webMailUrl}}
              onNavigationStateChange={handleNavigationStateChange}
            />
          </View>
        )}
      </Animated.View>
    </Screen>
  );
}

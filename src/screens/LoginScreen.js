import React, {useState} from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../colors';
import Button from '../components/Button';
import {Text, TextSubTitle, TextTitleLarge, TextXL} from '../components/Text';
import TextInput from '../components/TextInput';
import styles from '../styles';
import {useTranslation} from 'react-i18next';

export default function LoginScreen(props) {
  const {t} = useTranslation();
  const [height, setHeight] = useState(
    Dimensions.get('window').height + StatusBar.currentHeight,
  );

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View>
      <LinearGradient
        colors={[colors.gradient1, colors.gradient2]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        height={height}>
        <ImageBackground source={require('../../assets/images/background.png')}>
          <SafeAreaView style={_styles.splash}>
            <StatusBar translucent backgroundColor="transparent" />
            <View
              style={{...styles.container, flex: 1, flexDirection: 'column'}}>
              <View style={{...styles.withHorizontalPadding, ..._styles.intro}}>
                <TextTitleLarge
                  text="Open PoliTo"
                  color="white"
                  weight="bold"
                />
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
                    textContentType="emailAddress"
                    placeholder={t('userPlaceholder')}
                    icon="account-circle"
                    onChangeText={txt => {
                      setUsername(txt);
                    }}
                  />
                  <TextInput
                    spaced
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
                    text={`${t('version')} 0.3.0`}
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
        </ImageBackground>
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

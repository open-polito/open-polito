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

export default function LoginScreen() {
  const [isKbdVisible, setIsKbdVisible] = useState('');
  const [height, setHeight] = useState(
    Dimensions.get('window').height + StatusBar.currentHeight,
  );

  // Listen for keyboard visibility changes
  useEffect(() => {
    const kbdShowSub = Keyboard.addListener('keyboardDidShow', () => {
      setIsKbdVisible(true);
    });
    const kbdHideSub = Keyboard.addListener('keyboardDidHide', () => {
      setIsKbdVisible(false);
    });

    return () => {
      kbdShowSub.remove();
      kbdHideSub.remove();
    };
  }, []);

  // Handle keyboard visibility change
  // TODO layout optimization when keyboard shown
  useEffect(() => {
    if (isKbdVisible) {
    } else {
    }
  }, [isKbdVisible]);

  return (
    <LinearGradient
      colors={[colors.gradient1, colors.gradient2]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      height={height}>
      <ImageBackground source={require('../../assets/images/background.png')}>
        <SafeAreaView style={_styles.splash}>
          <StatusBar translucent backgroundColor="transparent" />
          <View style={_styles.container}>
            <View style={{...styles.withHorizontalPadding, ..._styles.intro}}>
              <TextTitle text="Open PoliTo" color="white" weight="bold" />
              <TextSubTitle
                text="The unofficial, open-source
mobile app"
                color="white"
                style={{marginTop: 20}}
              />
            </View>
            <View
              style={{...styles.withHorizontalPadding, ..._styles.loginCard}}>
              <TextAction text="Log in to continue" />
              <TextInput
                textContentType="emailAddress"
                placeholder="Username or e-mail address"
                icon="account-circle"
              />
              <TextInput
                textContentType="password"
                placeholder="Password"
                icon="lock-outline"
                secureTextEntry={true}
              />
              <Button text="Log in" />
            </View>
            <View style={_styles.versionView}>
              <Text
                text="version 1.0.0"
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
  container: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'space-between',
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

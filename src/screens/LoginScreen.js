import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Pressable,
  Keyboard,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

  // TODO Custom components to avoid repeating styles
  return (
    <LinearGradient
      colors={['#0029FF', '#0010A4']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      height={height}>
      <ImageBackground source={require('../background.png')}>
        <SafeAreaView style={styles.splash}>
          <StatusBar translucent backgroundColor="transparent" />
          <View behavior={'height'} style={styles.container}>
            <View style={{...styles.withPadding, ...styles.intro}}>
              <Text style={{...styles.textWhite, ...styles.title}}>
                Open PoliTo
              </Text>
              <Text style={{...styles.textWhite, ...styles.subTitle}}>
                The unofficial, open-source{'\n'}mobile app
              </Text>
            </View>
            <View style={{...styles.withPadding, ...styles.loginCard}}>
              <Text style={{...styles.text, ...styles.loginTitle}}>
                Log in to continue
              </Text>
              <View style={styles.textInput}>
                <Icon name="account-circle" size={24} color="#0029FF" />
                <TextInput
                  style={{
                    ...styles.text,
                    ...styles.textSmall,
                    ...styles.textInputText,
                  }}
                  textContentType="emailAddress"
                  placeholder="Username or e-mail address"
                />
              </View>
              <View style={styles.textInput}>
                <Icon name="lock-outline" size={24} color="#0029FF" />
                <TextInput
                  style={{
                    ...styles.text,
                    ...styles.textSmall,
                    ...styles.textInputText,
                  }}
                  textContentType="password"
                  secureTextEntry={true}
                  placeholder="Password"
                />
              </View>
              <View>
                <Pressable style={styles.btn} android_ripple={{color: '#eee'}}>
                  <Text style={styles.textWhite}>Log in</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.versionView}>
              <Text
                style={{
                  ...styles.textWhite,
                  marginHorizontal: 'auto',
                  position: 'absolute',
                  textAlign: 'center',
                  width: '100%',
                  bottom: 24,
                }}>
                version 1.0.0
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </LinearGradient>
  );
}

// TODO separate files for styles and colors
const styles = StyleSheet.create({
  withPadding: {
    paddingHorizontal: 24,
  },
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
    backgroundColor: '#EEE',
    paddingVertical: 24,
    elevation: 8,
  },
  loginTitle: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 24,
  },
  textInput: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 4,
    borderColor: '#0029FF',
    width: '100%',
    paddingHorizontal: 8,
  },
  textInputText: {
    width: '100%',
    fontSize: 12,
  },
  btn: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0029FF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 4,
    elevation: 3,
  },
  text: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: '#222',
  },
  textWhite: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: '#EEE',
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 42,
  },
  subTitle: {
    marginTop: 16,
  },
});

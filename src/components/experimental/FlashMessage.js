import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StatusBar, StyleSheet, View} from 'react-native';
import colors from '../colors';
import {TextM, TextN} from './Text';
import Icon from 'react-native-vector-icons/MaterialIcons';

/**
 * Custom flash message component.
 * Not ready for use yet.
 */
export default function FlashMessage({
  type,
  text,
  iconName = null,
  details = '',
  loading = false, // show loading animation.
  // TODO loading
  dismissable = false, // can be closed with an X button
  // TODO implement dismissable overlay
  duration = 3000,
}) {
  let color = '';
  switch (type) {
    case 'critical':
      color = colors.red;
      break;
    case 'warn':
      color = colors.orange;
      break;
    case 'info':
      color = colors.gradient1;
      break;
    default:
      color = colors.white;
      break;
  }

  const animYPos = useRef(new Animated.Value(-110)).current;
  const animHeight = useRef(new Animated.Value(0)).current;

  const statusBarHeight = StatusBar.currentHeight;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(animYPos, {
          toValue: 0,
          duration: 250,
          easing: Easing.elastic(),
          useNativeDriver: false,
        }),
        Animated.timing(animHeight, {
          toValue: 110,
          duration: 250,
          easing: Easing.elastic(),
          useNativeDriver: false,
        }),
      ]),
      Animated.delay(duration),
      Animated.parallel([
        Animated.timing(animYPos, {
          toValue: -110,
          duration: 250,
          easing: Easing.elastic(),
          useNativeDriver: false,
        }),
        Animated.timing(animHeight, {
          toValue: 0,
          duration: 250,
          easing: Easing.elastic(),
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  }, [animYPos, animHeight]);

  return (
    <Animated.View
      style={{
        ..._styles.overlayContainer,
        height: animHeight,
        transform: [
          {
            translateY: animYPos,
          },
        ],
      }}>
      <View
        style={{
          ..._styles.overlay,
          backgroundColor: color,
          paddingTop: statusBarHeight + 12,
        }}>
        <View style={_styles.iconContainer}>
          <Icon name={iconName} size={32} color={colors.white} />
        </View>
        <View style={_styles.infoContainer}>
          <TextM style={_styles.text} text={text} />
          <TextN style={_styles.text} text={details} />
        </View>
      </View>
    </Animated.View>
  );
}

const _styles = StyleSheet.create({
  overlayContainer: {
    position: 'relative',
  },
  overlay: {
    // position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginLeft: 32,
    marginRight: 16,
  },
  infoContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  text: {
    color: colors.white,
    marginBottom: 4,
  },
});

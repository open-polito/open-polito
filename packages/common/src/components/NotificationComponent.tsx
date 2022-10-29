import React from 'react';
import {Pressable, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {RenderHTMLSource} from 'react-native-render-html';
import colors from '../colors';
import styles from '../styles';
import {TextS, TextXS} from './Text';

const NotificationComponent = ({
  read,
  date,
  title,
  body,
  handlePress,
  compact = false,
}: {
  read: boolean;
  date: string;
  title: string | null;
  body: string | null;
  handlePress: () => void;
  compact?: boolean;
}) => {
  const offset = useSharedValue(0);

  const animStyles = useAnimatedStyle(() => {
    return {
      width: read
        ? withTiming(0, {duration: 500})
        : withTiming(12 - offset.value, {duration: 500}),
      height: read
        ? withTiming(0, {duration: 500})
        : withTiming(12 - offset.value, {duration: 500}),
      marginRight: read
        ? withTiming(0, {duration: 500})
        : withTiming(6, {duration: 500}),
    };
  });

  return (
    <Pressable
      disabled={compact}
      onPress={() => {
        if (!read) offset.value = 12;
        handlePress();
      }}
      android_ripple={{color: colors.lightGray}}
      style={[
        {
          paddingHorizontal: compact ? 0 : 8,
          paddingVertical: compact ? 0 : 8,
          marginBottom: compact ? 0 : 16,
          backgroundColor: colors.white,
        },
        compact ? {} : {...styles.elevatedSmooth, ...styles.border},
      ]}>
      <Animated.View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Animated.View
          style={[
            animStyles,
            {
              backgroundColor: colors.red,
              borderRadius: 12,
            },
          ]}
        />
        {compact ? (
          <TextXS text={date} weight="bold" />
        ) : (
          <TextS text={date} weight="medium" />
        )}
      </Animated.View>
      {title ? (
        <View
          style={{
            flexDirection: 'row',
            overflow: 'hidden',
            marginTop: 4,
          }}>
          <TextS text={title} weight="bold" />
        </View>
      ) : null}
      {body ? (
        compact ? (
          <TextXS text={body} numberOfLines={2} />
        ) : (
          <RenderHTMLSource source={{html: body}} />
        )
      ) : null}
    </Pressable>
  );
};

export default NotificationComponent;

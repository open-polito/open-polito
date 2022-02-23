import React, {useEffect} from 'react';
import {Text as RNText} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import colors from '../colors';
import styles from '../styles';

function TextBase({
  text,
  color = colors.black,
  weight = 'regular',
  size = 'normal',
  style = {},
  ...props
}) {
  // TODO execute check only once
  let textWeight = null;
  let textSize = null;
  switch (weight) {
    case 'regular':
      textWeight = styles.textRegular;
      break;
    case 'medium':
      textWeight = styles.textMedium;
      break;
    case 'bold':
      textWeight = styles.textBold;
      break;
  }
  switch (size) {
    case 'xs':
      textSize = styles.textExtraSmall;
      break;
    case 's':
      textSize = styles.textSmall;
      break;
    case 'n':
      textSize = styles.textNormal;
      break;
    case 'm':
      textSize = styles.textMediumSize;
      break;
    case 'l':
      textSize = styles.textLarge;
      break;
    case 'xl':
      textSize = styles.textExtraLarge;
      break;
  }
  return (
    <RNText
      style={{
        color: color,
        ...textWeight,
        ...textSize,
        ...style,
      }}
      {...props}>
      {text}
    </RNText>
  );
}

// Custom base components, differing in size

export function TextXS({
  text,
  color = colors.black,
  weight = 'regular',
  style = {},
  ...props
}) {
  return (
    <TextBase
      text={text}
      color={color}
      weight={weight}
      size="xs"
      style={style}
      {...props}
    />
  );
}

export function TextS({
  text,
  color = colors.black,
  weight = 'regular',
  style = {},
  ...props
}) {
  return (
    <TextBase
      text={text}
      color={color}
      weight={weight}
      size="s"
      style={style}
      {...props}
    />
  );
}

export function TextN({
  text,
  color = colors.black,
  weight = 'regular',
  style = {},
  ...props
}) {
  return (
    <TextBase
      text={text}
      color={color}
      weight={weight}
      size="n"
      style={style}
      {...props}
    />
  );
}

export function TextM({
  text,
  color = colors.black,
  weight = 'regular',
  style = {},
  ...props
}) {
  return (
    <TextBase
      text={text}
      color={color}
      weight={weight}
      size="m"
      style={style}
      {...props}
    />
  );
}

export function TextL({
  text,
  color = colors.black,
  weight = 'regular',
  style = {},
  ...props
}) {
  return (
    <TextBase
      text={text}
      color={color}
      weight={weight}
      size="l"
      style={style}
      {...props}
    />
  );
}

export function TextXL({
  text,
  color = colors.black,
  weight = 'regular',
  style = {},
  ...props
}) {
  return (
    <TextBase
      text={text}
      color={color}
      weight={weight}
      size="xl"
      style={style}
      {...props}
    />
  );
}

// Components to use in the UI

export function Text({text, color = colors.black, style = {}, ...props}) {
  return <TextN text={text} color={color} style={style} {...props} />;
}

export function TextTitle({text, color = colors.black, style = {}, ...props}) {
  const offset = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: -offset.value * 8}],
      opacity: 1 - offset.value,
    };
  });

  useEffect(() => {
    offset.value = withSpring(0);
  }, []);

  return (
    <Animated.View style={[animStyle]}>
      <TextXL
        text={text}
        color={color}
        weight="bold"
        style={style}
        {...props}
      />
    </Animated.View>
  );
}

export function TextTitleLarge({
  text,
  color = colors.black,
  style = {},
  ...props
}) {
  return (
    <TextTitle
      text={text}
      color={color}
      weight="bold"
      style={{...style, ...styles.textTitleLarge}}
      {...props}
    />
  );
}

export function TextSubTitle({
  text,
  color = colors.black,
  style = {},
  ...props
}) {
  return (
    <TextN text={text} color={color} weight="medium" style={style} {...props} />
  );
}

export function TextAction({text, color = colors.black, style = {}, ...props}) {
  return (
    <TextL
      text={text}
      color={color}
      weight="regular"
      style={style}
      {...props}
    />
  );
}

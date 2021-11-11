import React from 'react';
import {Text as RNText} from 'react-native';
import colors from '../colors';
import styles from '../styles';

function TextBase({
  text,
  color = colors.black,
  weight = 'regular',
  size = 'normal',
  style = {},
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
    case 's':
      textSize = styles.textSmall;
      break;
    case 'n':
      textSize = styles.textNormal;
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
      }}>
      {text}
    </RNText>
  );
}

// Custom base components, differing in size

export function TextS({
  text,
  color = colors.black,
  weight = 'regular',
  style = {},
}) {
  return (
    <TextBase
      text={text}
      color={color}
      weight={weight}
      size="s"
      style={style}
    />
  );
}

export function TextN({
  text,
  color = colors.black,
  weight = 'regular',
  style = {},
}) {
  return (
    <TextBase
      text={text}
      color={color}
      weight={weight}
      size="n"
      style={style}
    />
  );
}

export function TextL({
  text,
  color = colors.black,
  weight = 'regular',
  style = {},
}) {
  return (
    <TextBase
      text={text}
      color={color}
      weight={weight}
      size="l"
      style={style}
    />
  );
}

export function TextXL({
  text,
  color = colors.black,
  weight = 'regular',
  style = {},
}) {
  return (
    <TextBase
      text={text}
      color={color}
      weight={weight}
      size="xl"
      style={style}
    />
  );
}

// Components to use in the UI

export function Text({text, color = colors.black, style = {}}) {
  return <TextN text={text} color={color} style={style} />;
}

export function TextTitle({text, color = colors.black, style = {}}) {
  return <TextXL text={text} color={color} weight="bold" style={style} />;
}

export function TextSubTitle({text, color = colors.black, style = {}}) {
  return <TextN text={text} color={color} weight="medium" style={style} />;
}

export function TextAction({text, color = colors.black, style = {}}) {
  return <TextL text={text} color={color} weight="regular" style={style} />;
}

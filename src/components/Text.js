import React from 'react';
import {Text as RNText} from 'react-native';
import styles from '../styles';

function TextBase({
  text,
  color = 'black',
  weight = 'regular',
  size = 'normal',
  style = {},
}) {
  // TODO execute check only once
  const textColor = color == 'black' ? styles.blackText : styles.whiteText;
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
        ...textColor,
        ...textWeight,
        ...textSize,
        ...style,
      }}>
      {text}
    </RNText>
  );
}

// Custom base components, differing in size

export function TextS({text, color = 'black', weight = 'regular', style = {}}) {
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

export function TextN({text, color = 'black', weight = 'regular', style = {}}) {
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

export function TextL({text, color = 'black', weight = 'regular', style = {}}) {
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
  color = 'black',
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

export function Text({text, color = 'black', style = {}}) {
  return <TextN text={text} color={color} style={style} />;
}

export function TextTitle({text, color = 'black', style = {}}) {
  return <TextXL text={text} color={color} weight="bold" style={style} />;
}

export function TextSubTitle({text, color = 'black', style = {}}) {
  return <TextN text={text} color={color} weight="medium" style={style} />;
}

export function TextAction({text, color = 'black', style = {}}) {
  return <TextL text={text} color={color} weight="regular" style={style} />;
}

import React, {FC, ReactNode, useMemo} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import colors from '../../colors';
import Text from './Text';

/**
 * Wraps a component inside a view showing a badge.
 *
 * The badge is hidden if the number is 0.
 *
 * @param param0
 * @returns
 */
const BadgeContainer: FC<{
  children: ReactNode;
  style?: ViewStyle;
  number: number;
}> = ({children, style = {}, number}) => {
  const badgeText = useMemo(() => {
    return typeof number == 'string' ? number : number > 99 ? '99+' : number;
  }, [number]);

  return (
    <View style={{...style}}>
      {children}
      {badgeText != 0 ? (
        <View style={_styles.badge}>
          <Text w="r" s={10} c={colors.gray100}>
            {badgeText}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const _styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: colors.red,
    right: -10,
    top: -10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BadgeContainer;

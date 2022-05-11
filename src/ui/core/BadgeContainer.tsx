import React, {FC, ReactNode, useMemo} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import colors from '../../colors';
import {p} from '../../scaling';
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
          <Text w="r" s={10 * p} c={colors.gray100}>
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
    width: 20 * p,
    height: 20 * p,
    borderRadius: 20 * p,
    backgroundColor: colors.red,
    right: -10 * p,
    top: -10 * p,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BadgeContainer;

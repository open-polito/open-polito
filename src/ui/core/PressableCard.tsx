import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {LayoutChangeEvent, StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import colors from '../../colors';
import {p} from '../../scaling';
import PressableBase from './PressableBase';
import TablerIcon from './TablerIcon';
import Text from './Text';

interface PressableCardProps {
  dark: boolean;
  title?: string;
  description?: string;
  onPress: () => any;
  expanded?: boolean;
  sideElement?: ReactNode; // Element to show right next to title and description
  expandedElement?: ReactNode; // Element to show only when card expanded
  children?: ReactNode; // Always shown
}

const PressableCard: FC<PressableCardProps> = ({
  dark,
  title,
  description,
  onPress,
  expanded,
  sideElement,
  expandedElement,
  children,
}) => {
  const rotation = useSharedValue(0);

  /**
   * Opacity of the whole component
   */
  const opacity = useSharedValue(0);

  const sideElementOpacity = useSharedValue(1);

  const [computedHeight, setComputedHeight] = useState<number | null>(null);
  const expandedElementHeight = useSharedValue(0);
  const expandedElementOpacity = useSharedValue(0);

  const animCardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  /**
   * Element that will actually be rendered in the expanded section
   */
  const [expandedToRender, setExpandedToRender] = useState<ReactNode | null>(
    expandedElement,
  );

  /**
   * Update expanded element, giving time to complete the animation
   */
  useEffect(() => {
    let result: ReactNode | undefined;
    if (expanded || !computedHeight) {
      result = expandedElement;
    } else {
      result = <View />;
    }
    result &&
      setTimeout(
        () => {
          setExpandedToRender(result);
        },
        expanded ? 0 : 200,
      );
  }, [expanded, expandedElement, computedHeight]);

  /**
   * Callback used when the height of the expanded element has been computed
   */
  const onExpandedElementLayout = useCallback(
    (e: LayoutChangeEvent) => {
      // Only execute once, i.e. when the computedHeight is still null
      if (computedHeight !== null) {
        return;
      }
      // Make component visible again
      opacity.value = withTiming(1, {
        duration: 200,
      });
      // Set computed height
      setComputedHeight(e.nativeEvent.layout.height);
    },
    [computedHeight, opacity],
  );

  useEffect(() => {
    if (computedHeight === 0) {
      return;
    }
    const condition = expanded && expandedElement;
    rotation.value = withTiming(condition ? 90 : 0, {duration: 200});
    expandedElementOpacity.value = withTiming(condition ? 1 : 1, {
      duration: 400,
    });
  }, [
    expanded,
    rotation,
    expandedElementOpacity,
    expandedElement,
    computedHeight,
  ]);

  useEffect(() => {
    sideElementOpacity.value = withTiming(sideElement ? 1 : 0, {duration: 400});
  }, [sideElement, sideElementOpacity]);

  const animChevronStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${rotation.value}deg`,
      },
    ],
  }));

  /**
   * When computed height is set, change the height
   */
  useEffect(() => {
    if (computedHeight) {
      expandedElementHeight.value = withTiming(expanded ? computedHeight : 0, {
        duration: 200,
      });
    }
  }, [computedHeight, expandedElementHeight, expanded]);

  const expandedElementStyle = useAnimatedStyle(() => ({
    ...(computedHeight !== null
      ? {
          height: expandedElementHeight.value,
        }
      : {}),
    opacity: withTiming(expanded && computedHeight !== null ? 1 : 0, {
      duration: 200,
    }),
  }));

  const sideElementStyle = useAnimatedStyle(() => ({
    opacity: sideElementOpacity.value,
  }));

  const styles = useMemo(() => {
    return StyleSheet.create({
      button: {
        paddingVertical: 8 * p,
        paddingLeft: 16 * p,
        paddingRight: 8 * p,
        marginBottom: 16 * p,
        backgroundColor: dark ? colors.gray700 : colors.gray200,
        borderRadius: 4 * p,
      },
    });
  }, [dark]);

  return (
    <Animated.View style={[animCardStyle]}>
      <PressableBase
        onPress={onPress}
        android_ripple={{color: dark ? colors.gray400 : colors.gray500}}
        style={styles.button}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: expandedElement ? 'flex-start' : 'center',
          }}>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 4}}>
                {title && (
                  <Text
                    s={12 * p}
                    c={dark ? colors.gray200 : colors.gray700}
                    w="m">
                    {title}
                  </Text>
                )}
                {description && (
                  <Text
                    s={10 * p}
                    c={dark ? colors.gray300 : colors.gray600}
                    w="r">
                    {description}
                  </Text>
                )}
              </View>
              <Animated.View
                style={[sideElementStyle, {flex: sideElement ? 1 : 0}]}>
                {sideElement}
              </Animated.View>
              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                <View>
                  <Animated.View style={[animChevronStyle]}>
                    <TablerIcon
                      name="chevron-right"
                      color={dark ? colors.gray200 : colors.gray700}
                      size={24 * p}
                    />
                  </Animated.View>
                </View>
              </View>
            </View>
            <View style={{paddingRight: 8 * p}}>
              {children}
              <Animated.View
                onLayout={e => onExpandedElementLayout(e)}
                style={[expandedElementStyle]}>
                {expandedToRender}
              </Animated.View>
            </View>
          </View>
        </View>
      </PressableBase>
    </Animated.View>
  );
};

export default PressableCard;

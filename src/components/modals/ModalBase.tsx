import React, {
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {Modal, ScrollView, TouchableOpacity, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import colors, {Color} from '../../colors';
import {DeviceContext} from '../../context/Device';
import {ModalContext} from '../../context/ModalProvider';
import {p} from '../../scaling';
import Button from '../../ui/core/Button';
import TablerIcon from '../../ui/core/TablerIcon';
import Text from '../../ui/core/Text';

export interface ModalAction {
  type: 'colored' | 'main' | 'secondary';
  label: string;
  value: string;
  onSelect: (value: string) => Promise<any>;
  dismiss: boolean; // Whether to dismiss the modal when action executed
}

export interface ModalBaseProps {
  title: string;
  actions?: ModalAction[];
  dismissable?: boolean;
  onDismiss?: () => any;
  children: ReactNode;
  icon?: string;
  accentColor?: Color;
}

const ModalBase: FC<ModalBaseProps> = ({
  title,
  actions,
  dismissable = true,
  onDismiss = () => {},
  children,
  icon,
  accentColor,
}) => {
  const {dark} = useContext(DeviceContext);
  const {visible, hideModal} = useContext(ModalContext);

  const [internalVisible, setInternalVisible] = useState(true);

  const dismiss = useCallback(() => {
    if (dismissable) {
      setTimeout(() => setInternalVisible(false), 200);
      hideModal();
      onDismiss();
    }
  }, [hideModal, dismissable, onDismiss]);

  const offset = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: `rgba(0, 0, 0, ${offset.value / 2})`,
      opacity: offset.value,
      transform: [
        {
          scale: 1.1 - 0.1 * offset.value,
        },
      ],
    };
  });

  useEffect(() => {
    offset.value = withTiming(visible ? 1 : 0, {duration: 200});
  }, [visible, offset]);

  return (
    <Modal
      transparent={true}
      visible={internalVisible}
      animationType="none"
      statusBarTranslucent={true}
      onRequestClose={dismiss}>
      <Animated.View style={[animStyle, {flex: 1, justifyContent: 'center'}]}>
        <TouchableOpacity onPress={dismiss} style={{flex: 1}} />
        <View
          style={{
            maxHeight: '80%',
            backgroundColor: dark ? colors.gray700 : colors.gray200,
            borderRadius: 4 * p,
            marginHorizontal: 16 * p,
          }}>
          <ScrollView>
            <View
              style={{
                paddingVertical: 24 * p,
                paddingHorizontal: 16 * p,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {icon && (
                  <>
                    <TablerIcon name={icon} color={accentColor} size={24 * p} />
                    <View style={{width: 16 * p}} />
                  </>
                )}
                <Text s={16} w="m" c={dark ? colors.gray100 : colors.gray800}>
                  {title}
                </Text>
              </View>
              <View
                style={{
                  marginTop: 16 * p,
                }}>
                {children}
              </View>
            </View>
          </ScrollView>
          {actions && (
            <View
              style={{
                flexDirection: 'row',
                paddingBottom: 24 * p,
                paddingHorizontal: 16 * p,
              }}>
              {actions.map((action, i) => (
                <View
                  key={action.value}
                  style={[
                    {
                      flex: 1,
                    },
                    i !== 0
                      ? {
                          marginLeft: 32 * p,
                        }
                      : {},
                  ]}>
                  <Button
                    color={
                      action.type === 'colored' ? accentColor : colors.accent300
                    }
                    secondary={action.type === 'secondary'}
                    text={action.label}
                    onPress={() => {
                      action.onSelect(action.value).then(() => {
                        action.dismiss && dismiss();
                      });
                    }}
                  />
                </View>
              ))}
            </View>
          )}
        </View>
        <TouchableOpacity onPress={dismiss} style={{flex: 1}} />
      </Animated.View>
    </Modal>
  );
};

export default ModalBase;

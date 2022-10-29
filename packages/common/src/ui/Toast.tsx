import React, {FC, useContext, useEffect, useMemo, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../colors';
import {DeviceContext} from '../context/Device';
import {p} from '../scaling';
import {SessionState, setToast} from '../store/sessionSlice';
import {AppDispatch, RootState} from '../store/store';
import PressableBase from './core/PressableBase';
import TablerIcon from './core/TablerIcon';
import Text from './core/Text';

// TODO swipe to dismiss
// TODO in/out animation

const types = {
  success: ['circle-check', colors.green],
  warn: ['alert-triangle', colors.orange],
  err: ['circle-x', colors.red],
  info: ['info-circle', colors.accent300],
};

const Toast = () => {
  const {dark} = useContext(DeviceContext);
  const {toast} = useSelector<RootState, SessionState>(state => state.session);
  const dispatch = useDispatch<AppDispatch>();

  const timeoutRef = useRef<any>(null);

  // Hide toast after some time
  useEffect(() => {
    if (toast.visible) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(dismissToast, 5000);
    }
  }, [toast]);

  // Handles other stuff before resetting toast
  const dismissToast = () => {
    setTimeout(resetToast, 0);
  };

  // Resets toast to default state
  const resetToast = () => {
    dispatch(setToast({icon: '', visible: false, message: '', type: 'info'}));
  };

  const _styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        borderWidth: 1 * p,
        borderColor: types[toast.type][1],
        borderRadius: 4 * p,
        backgroundColor: dark ? colors.gray700 : colors.gray200,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16 * p,
        marginTop: 16 * p,
        padding: 12 * p,
      },
    });
  }, [toast, dark]);

  return toast.visible ? (
    <View style={_styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TablerIcon
          name={toast.icon ? toast.icon : types[toast.type][0]}
          color={types[toast.type][1]}
          size={18 * p}
          style={{marginRight: 12 * p}}
        />
        <Text
          s={12 * p}
          w="m"
          c={colors.gray100}
          style={{flex: 1, marginRight: 2 * p}}>
          {toast.message}
        </Text>
        <PressableBase onPress={dismissToast}>
          <TablerIcon
            name="x"
            color={dark ? colors.gray100 : colors.gray800}
            size={18 * p}
          />
        </PressableBase>
      </View>
    </View>
  ) : null;
};

export default Toast;

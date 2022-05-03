import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Modal, ScrollView, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../colors';
import {setDialog} from '../../store/sessionSlice';
import {RootState} from '../../store/store';
import styles from '../../styles';
import {
  DialogParams,
  DIALOG_TYPE,
  ListSelectorDialogParams,
  TimetableEventDialogParams,
  TimetableOptionsDialogParams,
} from '../../types';
import {TextL} from '../Text';
import ListSelectorDialog from './ListSelectorDialog';
import NotificationsDialog from './NotificationsDialog';
import TimetableEventDialog from './TimetableEventDialog';
import TimetableOptionsDialog from './TimetableOptionsDialog';

const Dialog = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const dialog = useSelector<
    RootState,
    {visible: boolean; params: DialogParams | null}
  >(state => state.session.dialog);

  const [title, setTitle] = useState('');

  const [fixedHeight, setFixedHeight] = useState(false);

  const dialogComponent = useMemo(() => {
    switch (dialog.params?.type) {
      case DIALOG_TYPE.LIST_SELECTOR:
        setTitle(dialog.params?.title || '');
        setFixedHeight(false);
        return (
          <ListSelectorDialog
            {...{...(dialog.params as ListSelectorDialogParams)}}
          />
        );
      case DIALOG_TYPE.TIMETABLE_OPTIONS:
        setTitle(t('timetableOptions'));
        setFixedHeight(false);
        return (
          <TimetableOptionsDialog
            {...{...(dialog.params as TimetableOptionsDialogParams)}}
          />
        );
      case DIALOG_TYPE.TIMETABLE_EVENT:
        setTitle(
          (dialog.params as TimetableEventDialogParams).slot.course_name,
        );
        setFixedHeight(false);
        return (
          <TimetableEventDialog
            {...{...(dialog.params as TimetableEventDialogParams)}}
          />
        );
      case DIALOG_TYPE.NOTIFICATIONS:
        setTitle(t('notifications'));
        setFixedHeight(true);
        return <NotificationsDialog />;
    }
  }, [dialog]);

  const offset = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: `rgba(0, 0, 0, ${offset.value})`,
    };
  });

  useEffect(() => {
    dialog.visible
      ? (offset.value = withTiming(0.5, {duration: 250}))
      : (offset.value = withTiming(0, {duration: 250}));
  }, [dialog.visible]);

  return (
    <Animated.View
      style={[
        animStyle,
        {
          height: '100%',
          width: '100%',
          position: 'absolute',
          display: dialog.visible ? 'flex' : 'none',
        },
      ]}>
      {dialog.visible ? (
        <Modal
          transparent={true}
          visible={dialog.visible}
          animationType="slide"
          statusBarTranslucent={true}
          onRequestClose={() => {
            dispatch(setDialog({...dialog, visible: false, params: null}));
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}>
            <View
              style={{
                maxHeight: '80%',
                flex: fixedHeight ? 1 : 0,
                backgroundColor: colors.white,
                paddingTop: 24,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
              }}>
              <View
                style={{
                  marginHorizontal:
                    styles.withHorizontalPadding.paddingHorizontal,
                  paddingBottom: 8,
                }}>
                <TextL text={title} weight="bold" />
              </View>
              {dialogComponent}
            </View>
          </View>
        </Modal>
      ) : null}
    </Animated.View>
  );
};

export default Dialog;

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import Header, {HEADER_TYPE} from '../ui/Header';
import Screen from '../ui/Screen';
import {
  deleteNotification,
  markNotificationRead,
  Notification,
  NotificationType,
} from 'open-polito-api/lib/notifications';
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {DeviceContext} from '../context/Device';
import store, {AppDispatch, RootState} from '../store/store';
import {
  getNotificationList,
  setNotifications,
  UserState,
} from '../store/userSlice';
import Tabs from '../ui/Tabs';
import {p} from '../scaling';
import NotificationComponent from '../ui/Notification';
import NoContent from '../ui/NoContent';
import {STATUS} from '../store/status';
import PressableBase from '../ui/core/PressableBase';
import {CoursesState} from '../store/coursesSlice';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import colors from '../colors';
import Checkbox from '../ui/core/Checkbox';
import {LongPressGestureHandler, State} from 'react-native-gesture-handler';
import TablerIcon from '../ui/core/TablerIcon';
import Text from '../ui/core/Text';

const _SelectableNotification = ({
  dark,
  n,
  handlePress,
  courseName,
  selecting,
  setSelecting,
  selected,
  onSelectionChange,
}: {
  dark: boolean;
  n: Notification;
  handlePress: (id: number) => any;
  courseName: string;
  selecting: boolean;
  setSelecting: (selecting: boolean) => any;
  selected: boolean;
  onSelectionChange: (id: number, selected: boolean) => any;
}) => {
  const offset = useSharedValue(0);

  const animStyleCheckbox = useAnimatedStyle(() => ({
    width: 32 * p * offset.value,
    transform: [
      {
        scale: offset.value,
      },
    ],
    alignItems: 'flex-start',
  }));

  /**
   * Show/hide checkbox
   */
  useEffect(() => {
    offset.value = withTiming(selecting ? 1 : 0, {duration: 150});
  }, [selecting]);

  return (
    <View style={{flex: 1}}>
      <LongPressGestureHandler
        onHandlerStateChange={({nativeEvent}) => {
          if (nativeEvent.state === State.ACTIVE) {
            if (!selecting) {
              setSelecting(true);
              onSelectionChange(n.id, true);
            }
          }
        }}>
        <Animated.View
          style={{
            marginBottom: 24 * p,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Animated.View style={[animStyleCheckbox]}>
            <Checkbox
              selected={selected}
              onChange={sel => onSelectionChange(n.id, sel)}
            />
          </Animated.View>
          <PressableBase style={{flex: 1}} onPress={() => handlePress(n.id)}>
            <NotificationComponent
              type={n.topic}
              notification={n}
              dark={dark}
              read={n.is_read}
              courseName={courseName}
            />
          </PressableBase>
        </Animated.View>
      </LongPressGestureHandler>
    </View>
  );
};

const Notifications = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const notificationTypes = [
    {label: t('allF'), value: 'all'},
    {label: t('readF'), value: 'read'},
    {label: t('unreadF'), value: 'unread'},
    {label: t('directAlerts'), value: 'direct'},
    {label: t('courses'), value: 'course'},
    {label: t('material'), value: 'material'},
  ];

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingTop: 24 * p,
          flex: 1,
        },
        paddingHorizontal: {
          paddingHorizontal: 16 * p,
        },
        list: {
          paddingHorizontal: 16 * p,
          paddingBottom: 24 * p,
        },
      }),
    [],
  );

  const {notifications, getNotificationsStatus} = useSelector<
    RootState,
    UserState
  >(state => state.user);

  const courses = useSelector<RootState, CoursesState>(state => state.courses);

  const {device, dark} = useContext(DeviceContext);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const refreshNotifications = () => {
    setRefreshing(true);
    dispatch(getNotificationList(device));
  };

  const getNotificationCourseName = (notification: Notification): string => {
    return (
      courses.courses.find(
        course => course.basicInfo.id_incarico === (notification as any).course,
      )?.basicInfo.name || ''
    );
  };

  /**
   * Set refreshing to false when done refreshing
   */
  useEffect(() => {
    if (refreshing && getNotificationsStatus.code !== STATUS.PENDING) {
      setRefreshing(false);
    }
  }, [notifications, refreshing, getNotificationsStatus.code, courses]);

  /**
   * Set notification as read.
   * @param id The id of the notification
   */
  const handlePress = (id: number): void => {
    // Find the notification index
    const index = notifications.findIndex(n => n.id == id);

    // Don't proceed if not found or if already read
    if (index === -1) return;
    if (notifications[index].is_read) return;

    // Send read
    (async () => {
      await markNotificationRead(device, id);
    })();

    // Send updated array to store
    let copy = {...notifications[index]};
    copy.is_read = true;
    store.dispatch(
      setNotifications([
        ...notifications.slice(0, index),
        copy,
        ...notifications.slice(index + 1),
      ]),
    );
  };

  const visible = useMemo<Notification[]>(() => {
    switch (selectedCategory) {
      case 'all':
        return notifications;
      case 'read':
        return notifications.filter(n => n.is_read);
      case 'unread':
        return notifications.filter(n => !n.is_read);
      case 'direct':
        return notifications.filter(n => n.topic === NotificationType.DIRECT);
      case 'course':
        return notifications.filter(n => n.topic === NotificationType.NOTICE);
      case 'material':
        return notifications.filter(n => n.topic === NotificationType.MATERIAL);
      default:
        return [];
    }
  }, [notifications, selectedCategory]);

  /**
   * Whether we're in selection mode
   */
  const [selecting, setSelecting] = useState(false);
  /**
   * Selected notification ids in selection mode
   */
  const [selected, setSelected] = useState<number[]>([]);

  const tabOffset = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: 0.75 + 0.25 * tabOffset.value,
      },
      {
        translateY: 128 * p * (1 - tabOffset.value),
      },
    ],
  }));

  /**
   * Show/hide bottom bar
   */
  useEffect(() => {
    tabOffset.value = withTiming(selecting ? 1 : 0, {duration: 200});
  }, [selecting]);

  /**
   * On exiting selection mode
   */
  useEffect(() => {
    if (!selecting) setSelected([]);
  }, [selecting]);

  const handleSelectionChange = (id: number, sel: boolean) => {
    if (sel) {
      setSelected([...selected, id]);
    } else {
      setSelected(selected.filter(s => s !== id));
    }
  };

  /**
   * Quit selection mode if no selected items
   */
  useEffect(() => {
    if (selected.length === 0) {
      setSelecting(false);
    }
  }, [selected]);

  /**
   * When in selection mode, if the hardware back button is pressed,
   * exit selection mode instead of going back
   */
  const onHardwareBackButtonPressed = useCallback(() => {
    if (selecting) {
      setSelecting(false);
      return true;
    }
    setSelected([]);
    return false;
  }, [selecting]);

  /**
   * When changing tab, exit selection mode
   */
  useEffect(() => {
    setSelected([]);
    setSelecting(false);
  }, [selectedCategory]);

  /**
   * Setup & Cleanup
   */
  useEffect(() => {
    BackHandler.addEventListener(
      'hardwareBackPress',
      onHardwareBackButtonPressed,
    );
    return () => {
      setSelecting(false);
      setSelected([]);
      BackHandler.removeEventListener(
        'hardwareBackPress',
        onHardwareBackButtonPressed,
      );
    };
  }, []);

  const [deleting, setDeleting] = useState(false);

  const deleteSelected = () => {
    (async () => {
      setDeleting(true);
      for (let i = 0; i < selected.length; i++) {
        await deleteNotification(device, selected[i]);
      }
      setTimeout(() => {
        setDeleting(false);
        setSelecting(false);
      }, 500);
      refreshNotifications();
    })();
  };

  const areAllSelected = () => {
    let allSelected = true;
    for (let i = 0; i < visible.length; i++) {
      if (!selected.includes(visible[i].id)) {
        allSelected = false;
        break;
      }
    }
    return allSelected;
  };

  const selectionOptions = [
    {
      icon: areAllSelected() ? 'circle-minus' : 'circle-plus',
      value: 'selectAll',
      label: areAllSelected() ? t('deselectAll') : t('selectAll'),
      action: () =>
        areAllSelected()
          ? setSelected([])
          : setSelected(visible.map(n => n.id)),
    },
    {
      icon: deleting ? 'loading' : 'trash',
      value: 'delete',
      label: t('delete'),
      action: deleteSelected,
    },
    {
      icon: 'checks',
      value: 'markAsRead',
      label: t('markAsRead'),
      action: () => {
        selected.forEach(id => handlePress(id));
        setSelecting(false);
      },
    },
  ];

  return (
    <Screen>
      <Animated.View
        style={[
          animStyle,
          {
            position: 'absolute',
            bottom: 16 * p,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: dark ? colors.gray700 : colors.gray200,
            paddingVertical: 8 * p,
            marginHorizontal: 16 * p,
            borderRadius: 16 * p,
            borderWidth: 1 * p,
            borderColor: dark ? colors.gray600 : colors.gray300,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        {selectionOptions.map(opt => (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <PressableBase
              disabled={opt.icon === 'loading'}
              style={{justifyContent: 'center', alignItems: 'center'}}
              onPress={opt.action}>
              {opt.icon === 'loading' ? (
                <ActivityIndicator color={colors.accent300} size={20 * p} />
              ) : (
                <TablerIcon
                  name={opt.icon}
                  color={colors.accent300}
                  size={20 * p}
                />
              )}
              <View style={{height: 4 * p}} />
              <Text c={colors.accent300} w="r" s={10 * p}>
                {opt.label}
              </Text>
            </PressableBase>
          </View>
        ))}
      </Animated.View>
      <Header headerType={HEADER_TYPE.MAIN} title={t('notifications')} />
      <Tabs
        adjusted
        dark={dark}
        items={notificationTypes}
        onChange={(index: number) =>
          setSelectedCategory(notificationTypes[index].value)
        }
      />
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.paddingHorizontal}
          data={visible}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={<NoContent />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshNotifications}
            />
          }
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          renderItem={n => (
            <_SelectableNotification
              dark={dark}
              n={n.item}
              handlePress={id => handlePress(id)}
              courseName={getNotificationCourseName(n.item)}
              selecting={selecting}
              setSelecting={sel => setSelecting(sel)}
              selected={selected.includes(n.item.id)}
              onSelectionChange={(id, sel) => handleSelectionChange(id, sel)}
            />
          )}
        />
      </View>
    </Screen>
  );
};

export default Notifications;

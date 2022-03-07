import moment from 'moment';
import {
  markNotificationRead,
  Notification,
  NotificationType,
} from 'open-polito-api/notifications';
import React, {useContext, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, Pressable, ScrollView, View} from 'react-native';
import RenderHTML, {RenderHTMLSource} from 'react-native-render-html';
import {useSelector} from 'react-redux';
import colors from '../../colors';
import {DeviceContext} from '../../context/Device';
import store, {RootState} from '../../store/store';
import {setNotifications} from '../../store/userSlice';
import styles from '../../styles';
import HorizontalSelector from '../HorizontalSelector';
import {TextN, TextS, TextXS} from '../Text';

const NotificationsDialog = () => {
  const {t} = useTranslation();

  const notifications = useSelector<RootState, Notification[]>(
    state => state.user.notifications,
  );

  const deviceContext = useContext(DeviceContext);

  const [selected, setSelected] = useState('all');

  // TODO delete notification option

  /**
   * Set notification as read.
   * @param id The id of the notification
   */
  const handlePress = (id: number) => {
    // Find the notification index
    const index = notifications.findIndex(n => n.id == id);

    // Don't proceed if not found or if already read
    if (index == -1) return;
    if (notifications[index].is_read) return;

    // Send read
    (async () => {
      await markNotificationRead(deviceContext.device, id);
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
    switch (selected) {
      case 'all':
        return notifications;
      case 'read':
        return notifications.filter(n => n.is_read);
      case 'unread':
        return notifications.filter(n => !n.is_read);
      case 'direct':
        return notifications.filter(n => n.topic == NotificationType.DIRECT);
      case 'course':
        return notifications.filter(n => n.topic == NotificationType.NOTICE);
      case 'material':
        return notifications.filter(n => n.topic == NotificationType.MATERIAL);
      case 'test':
        return notifications.filter(n => n.topic == NotificationType.TEST);
      default:
        return [];
    }
  }, [notifications, selected]);

  return (
    <View style={{flex: 1}}>
      <View>
        <HorizontalSelector
          items={[
            {label: t('allF'), value: 'all'},
            {label: t('readF'), value: 'read'},
            {label: t('unreadF'), value: 'unread'},
            {label: t('directAlerts'), value: 'direct'},
            {label: t('courses'), value: 'course'},
            {label: t('material'), value: 'material'},
            {label: t('test'), value: 'test'},
          ]}
          onValueChange={(value: string) => setSelected(value)}
        />
        <View style={{paddingTop: 8}} />
      </View>
      <View style={{flex: 1}}>
        <FlatList
          ListFooterComponent={<View style={{paddingTop: 32}}></View>}
          data={visible}
          keyExtractor={item => item.id.toString()}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          renderItem={n => (
            <View key={n.index}>
              {n.item.is_read ? null : (
                <View
                  style={{
                    position: 'absolute',
                    backgroundColor: colors.red,
                    width: 12,
                    height: 12,
                    borderRadius: 12,
                    transform: [{translateX: 6}, {translateY: 10}],
                  }}
                />
              )}
              <Pressable
                onPress={() => {
                  handlePress(n.item.id);
                }}
                android_ripple={{color: colors.lightGray}}
                style={{
                  marginHorizontal:
                    styles.withHorizontalPadding.paddingHorizontal,
                  ...styles.elevatedSmooth,
                  ...styles.border,
                  paddingHorizontal: 8,
                  paddingVertical: 8,
                  marginBottom: 16,
                  backgroundColor: colors.white,
                }}>
                <TextS text={moment(n.item.time).format('lll')} />
                <View
                  style={{
                    flexDirection: 'row',
                    overflow: 'hidden',
                    marginTop: 4,
                  }}>
                  <TextS text={n.item.title} weight="bold" />
                </View>
                {n.item.body ? (
                  <RenderHTMLSource source={{html: n.item.body}} />
                ) : null}
              </Pressable>
            </View>
          )}></FlatList>
      </View>
    </View>
  );
};

export default NotificationsDialog;

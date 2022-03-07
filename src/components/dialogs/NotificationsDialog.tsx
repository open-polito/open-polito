import moment from 'moment';
import {
  markNotificationRead,
  Notification,
  NotificationType,
} from 'open-polito-api/notifications';
import React, {useContext, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, View} from 'react-native';
import {useSelector} from 'react-redux';
import {DeviceContext} from '../../context/Device';
import store, {RootState} from '../../store/store';
import {setNotifications} from '../../store/userSlice';
import styles from '../../styles';
import HorizontalSelector from '../HorizontalSelector';
import NotificationComponent from '../NotificationComponent';

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
  const handlePress = (id: number): void => {
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
            <View
              style={{
                marginHorizontal:
                  styles.withHorizontalPadding.paddingHorizontal,
              }}>
              <NotificationComponent
                read={n.item.is_read}
                date={moment(n.item.time).format('lll')}
                title={n.item.title}
                body={n.item.body}
                handlePress={() => {
                  handlePress(n.item.id);
                }}
              />
            </View>
          )}></FlatList>
      </View>
    </View>
  );
};

export default NotificationsDialog;

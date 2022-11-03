import React, {ReactElement, useEffect, useMemo} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import NoContent from './NoContent';
import NotificationComponent from './Notification';
import {NotificationType} from 'open-polito-api/lib/notifications';
import {p} from '../scaling';
import {ExtendedAlert} from '../types';

const CourseAlerts = ({
  alerts,
  dark,
  refreshControl,
}: {
  alerts: ExtendedAlert[];
  dark: boolean;
  refreshControl: ReactElement;
}) => {
  const _styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        paddingHorizontal: 16 * p,
        flex: 1,
      },
    });
  }, [dark]);

  return (
    <View
      style={{
        flexDirection: 'column',
        flex: 1,
      }}>
      <FlatList
        style={_styles.container}
        ListEmptyComponent={<NoContent />}
        ListHeaderComponent={() => <View style={{height: 24 * p}} />}
        refreshControl={refreshControl}
        data={alerts}
        initialNumToRender={1}
        keyExtractor={alert => alert.id + alert.date + alert.text.slice(0, 10)}
        renderItem={a => (
          <View style={{marginBottom: 24 * p}}>
            <NotificationComponent
              type={NotificationType.NOTICE}
              notification={a.item}
              dark={dark}
            />
          </View>
        )}
      />
    </View>
  );
};

export default CourseAlerts;

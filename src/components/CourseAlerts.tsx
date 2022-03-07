import {Notice} from 'open-polito-api/course';
import React from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import styles from '../styles';
import CourseAlert from './CourseAlert';
import NoContent from './NoContent';

const CourseAlerts = ({
  alerts,
  refresh,
}: {
  alerts: Notice[];
  refresh: Function;
}) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        flex: 1,
      }}>
      <FlatList
        ListEmptyComponent={<NoContent />}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              refresh();
            }}
          />
        }
        data={alerts}
        keyExtractor={alert => alert.date + alert.text.slice(0, 30)}
        renderItem={a => (
          <View style={{...styles.withHorizontalPadding}}>
            <CourseAlert alert={a.item} />
          </View>
        )}
      />
    </View>
  );
};

export default CourseAlerts;

import {Notice} from 'open-polito-api/course';
import React from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
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
    <View style={{flexDirection: 'column', flex: 1}}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              refresh();
            }}
          />
        }>
        {alerts.length > 0 ? (
          alerts.map(alert => {
            return (
              <CourseAlert
                alert={alert}
                key={alert.date + alert.text.slice(0, 30)}
              />
            );
          })
        ) : (
          <NoContent />
        )}
      </ScrollView>
    </View>
  );
};

export default CourseAlerts;

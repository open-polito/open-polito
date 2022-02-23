import React from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import CourseAlert from './CourseAlert';
import NoContent from './NoContent';

export default function CourseAlerts({alerts, refresh}) {
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
                key={alert.data.toString() + alert.info.slice(0, 30)}
              />
            );
          })
        ) : (
          <NoContent />
        )}
      </ScrollView>
    </View>
  );
}

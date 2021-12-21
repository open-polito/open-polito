import React from 'react';
import {ScrollView, View} from 'react-native';
import CourseAlert from './CourseAlert';
import NoContent from './NoContent';

export default function CourseAlerts({alerts}) {
  return (
    <View style={{flexDirection: 'column', flex: 1}}>
      <ScrollView>
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

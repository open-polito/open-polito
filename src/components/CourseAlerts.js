import React from 'react';
import {ScrollView, View} from 'react-native';
import CourseAlert from './CourseAlert';

export default function CourseAlerts({alerts}) {
  return (
    <View style={{flexDirection: 'column', flex: 1}}>
      <ScrollView>
        {alerts.map(alert => {
          return (
            <CourseAlert
              alert={alert}
              key={alert.data.toString() + alert.info.slice(0, 30)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

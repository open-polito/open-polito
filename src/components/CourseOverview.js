import React from 'react';
import {View} from 'react-native';
import MaterialWidget from './MaterialWidget';

export default function CourseOverview({courseData, changeTab}) {
  return (
    <View>
      <MaterialWidget
        courseCode={courseData.codice}
        action={() => {
          changeTab('material');
        }}
      />
    </View>
  );
}

import React from 'react';
import {View} from 'react-native';
import AlertWidget from './AlertWidget';
import MaterialWidget from './MaterialWidget';

export default function CourseOverview({courseData, changeTab}) {
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <MaterialWidget
        courseCode={courseData.codice}
        action={() => {
          changeTab('material');
        }}
      />
      <AlertWidget alerts={courseData.avvisi.slice(0, 3)} />
    </View>
  );
}

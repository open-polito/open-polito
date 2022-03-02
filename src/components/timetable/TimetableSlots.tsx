import moment from 'moment';
import {TimetableSlot} from 'open-polito-api/timetable';
import React, {useEffect, useMemo, useState} from 'react';
import {Dimensions, View} from 'react-native';
import colors, {courseColors} from '../../colors';
import styles from '../../styles';
import {TextXS} from '../Text';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TimetableDay from './TimetableDay';
import {Configuration} from '../../defaultConfig';

const TimetableSlots = ({
  timetableDays,
  config,
}: {
  timetableDays: TimetableSlot[][];
  config: Configuration['timetable'];
}) => {
  const [h, setH] = useState(Dimensions.get('window').height / 15);

  const [courseNames, setCourseNames] = useState<string[]>(['', '', '']);

  const getCourseNames = (): string[] => {
    let _courseNames: string[] = [];
    timetableDays.forEach(day => {
      day.forEach(slot => {
        if (!_courseNames.includes(slot.course_name)) {
          _courseNames.push(slot.course_name);
        }
      });
    });
    return _courseNames;
  };

  useEffect(() => {
    setCourseNames(getCourseNames());
  }, [timetableDays]);

  return (
    <View
      style={{
        position: 'absolute',
        flex: 1,
        ...styles.withHorizontalPadding,
        marginLeft: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}>
      {timetableDays.slice(1, 6).map((day, index) => (
        <TimetableDay
          config={config}
          key={index}
          {...{day, h, index, courseNames}}
        />
      ))}
    </View>
  );
};

export default TimetableSlots;

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
import {useDispatch, useSelector} from 'react-redux';
import {setConfig} from '../../store/sessionSlice';
import {RootState} from '../../store/store';

const TimetableSlots = ({
  loaded,
  timetableDays,
  layout,
  selectedDay,
}: {
  loaded: boolean;
  timetableDays: TimetableSlot[][];
  layout: 'week' | 'day';
  selectedDay: number;
}) => {
  const dispatch = useDispatch();
  const config = useSelector<RootState, Configuration>(
    state => state.session.config,
  );

  const [h, setH] = useState(Dimensions.get('window').height / 15);

  const [courseNames, setCourseNames] = useState<string[]>(['', '', '']);

  const days = useMemo<TimetableSlot[][]>(() => {
    if (timetableDays.length == 1) return timetableDays;
    return timetableDays.slice(1, 6);
  }, [timetableDays]);

  const getCourseNames = (): string[] => {
    let _courseNames: string[] = [];
    timetableDays.forEach(day => {
      day.forEach(slot => {
        if (!_courseNames.includes(slot.course_name)) {
          _courseNames.push(slot.course_name);
        }
      });
    });
    return _courseNames.sort();
  };

  useEffect(() => {
    setCourseNames(getCourseNames());
  }, [days]);

  /**
   * When course names or slots change, if priority enabled, update the priority list
   */
  useEffect(() => {
    if (!config.timetable.overlap || !config.timetable.priority) return;
    let _list: string[] = [...config.timetable.priority];
    courseNames.forEach(courseName => {
      if (!config.timetable.priority.includes(courseName)) {
        _list.push(courseName);
      }
    });
    dispatch(
      setConfig({...config, timetable: {...config.timetable, priority: _list}}),
    );
  }, [days, courseNames]);

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
      {(layout == 'week' ? days : [days[selectedDay - 1]]).map((day, index) => (
        <TimetableDay
          fake={!loaded}
          config={config.timetable}
          key={index}
          {...{day, h, index, courseNames}}
        />
      ))}
    </View>
  );
};

export default TimetableSlots;

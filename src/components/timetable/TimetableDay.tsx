import moment from 'moment';
import {TimetableSlot} from 'open-polito-api/timetable';
import React, {useMemo, useState} from 'react';
import {View} from 'react-native';
import colors from '../../colors';
import {Configuration} from '../../defaultConfig';
import TimetableDayLoader from '../loaders/TimetableDayLoader';
import TimetableEvent from './TimetableEvent';

const TimetableDay = ({
  fake = false,
  day,
  h,
  courseNames,
  config,
  index = 0,
}: {
  fake?: boolean;
  day: TimetableSlot[];
  h: number;
  courseNames: string[];
  config: Configuration['timetable'];
  index?: number;
}) => {
  const [w, setW] = useState(0);

  /**
   * Array of slots sorted by priority
   */
  const sortedByPriority: TimetableSlot[] = useMemo(() => {
    return [...day].sort(
      (a, b) =>
        config.priority.indexOf(b.course_name) -
        config.priority.indexOf(a.course_name),
    );
  }, [config.priority, config.overlap, index, day]);

  /**
   * Array of arrays of overlapping events.
   *
   * @remarks
   * Sub-array length equals number to divide width by.
   * Show overlapping events in the order given by their sub-array index.
   *
   * @example
   * ["course a", "course b", "course c"] means:
   *
   * <------------ WIDTH ------------->
   * |----------|----------|----------|
   * | course a | course b | course c |
   * |----------|----------|----------|
   */
  const overlapping: TimetableSlot[][] = useMemo(() => {
    if (config.overlap == 'priority') return []; // Only compute if splitting enabled
    if (day.length == 0) return []; // Only compute when slots fetched

    let _overlapping: TimetableSlot[][] = [];
    // Go through slots and find overlaps
    const start = moment(day[0].start_time).set({h: 8, m: 45});
    for (let i = 0; i < 9; i++) {
      start.add(90, 'm');
      let _localOverlapping: TimetableSlot[] = [];
      day.map(event => {
        if (
          event.start_time < start.toDate().getTime() &&
          start.toDate().getTime() < event.end_time
        ) {
          _localOverlapping.push(event);
        }
      });
      if (_localOverlapping.length > 1) _overlapping.push(_localOverlapping);
    }
    return _overlapping;
  }, [day, config.overlap]);

  /**
   * Finds and returns overlap group of given slot
   * @param slot The timetable slot
   * @returns overlap group
   */
  const findOverlapGroup = (slot: TimetableSlot): TimetableSlot[] => {
    let _group: TimetableSlot[] = [];
    overlapping.forEach(group => {
      if (group.includes(slot)) {
        _group = group;
        return;
      }
    });
    return _group;
  };

  return (
    <View
      onLayout={e => {
        setW(e.nativeEvent.layout.width);
      }}
      style={{
        backgroundColor: colors.white,
        flex: 1,
        zIndex: 200,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderLeftWidth: index > 0 ? 1 : 0,
        borderColor: colors.lightGray,
      }}>
      {fake ? (
        <TimetableDayLoader w={w} h={h} />
      ) : config.overlap == 'priority' ? (
        // If priority enabled, show sorted by priority
        sortedByPriority.map((slot, i) => (
          <TimetableEvent
            key={i}
            {...{overlapGroup: [], slot, w, h, courseNames, index: i}}
          />
        ))
      ) : (
        // If priority not enabled
        day.map((slot, i) => {
          const overlapGroup = findOverlapGroup(slot);
          const _index = overlapGroup.findIndex(_slot => slot == _slot);
          return (
            <TimetableEvent
              key={i}
              {...{overlapGroup, slot, w, h, courseNames, index: _index}}
            />
          );
        })
      )}
    </View>
  );
};

export default TimetableDay;

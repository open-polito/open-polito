import moment from 'moment';
import {TimetableSlot} from 'open-polito-api/timetable';
import React, {useEffect, useState} from 'react';
import {Dimensions, View} from 'react-native';
import colors, {courseColors} from '../../colors';
import styles from '../../styles';
import {TextXS} from '../Text';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const TimetableSlots = ({
  timetableDays,
}: {
  timetableDays: TimetableSlot[][];
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
        <View
          key={index}
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
          {day.map(slot => (
            <View
              style={{
                position: 'absolute',
                width: '100%',
                ...styles.border,
                ...styles.elevatedSmooth,
                padding: 4,
                backgroundColor:
                  courseColors[
                    courseNames.findIndex(val => val == slot.course_name)
                  ],
                height:
                  (moment.duration(slot.end_time - slot.start_time).as('ms') /
                    (3600 * 1000)) *
                  h,
                transform: [
                  {
                    translateY:
                      h +
                      (moment
                        .duration(
                          moment(slot.start_time).diff(
                            moment(slot.start_time).set({
                              h: 8,
                              m: 0,
                            }),
                          ),
                        )
                        .as('ms') /
                        (3600 * 1000)) *
                        h -
                      h / 2,
                  },
                ],
              }}>
              <TextXS
                text={slot.course_name}
                color={colors.white}
                numberOfLines={2}
              />
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 8,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  overflow: 'hidden',
                }}>
                <MaterialIcons
                  name="place"
                  size={12}
                  color={colors.lightGray}
                />
                <TextXS
                  numberOfLines={2}
                  text={slot.room}
                  color={colors.white}
                  style={{fontSize: 8, marginLeft: 2}}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 4,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  overflow: 'hidden',
                }}>
                <MaterialIcons
                  name="short-text"
                  size={12}
                  color={colors.lightGray}
                />
                <TextXS
                  numberOfLines={2}
                  text={slot.type}
                  color={colors.white}
                  style={{fontSize: 8, marginLeft: 2}}
                />
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default TimetableSlots;

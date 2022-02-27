import moment from 'moment';
import {getTimetable, TimetableSlot} from 'open-polito-api/timetable';
import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, View} from 'react-native';
import colors from '../colors';
import ArrowHeader from '../components/ArrowHeader';
import ScreenContainer from '../components/ScreenContainer';
import {TextN, TextS, TextXS} from '../components/Text';
import {DeviceContext} from '../context/Device';
import styles from '../styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

const CourseColors = ['#0E13B0', '#C2272C', '#E09326', '#6903AD', '#1E91D6'];

const Timetable = () => {
  const {t} = useTranslation();
  const deviceContext = useContext(DeviceContext);
  const navigation = useNavigation();

  const [h, setH] = useState(32);
  const [loaded, setLoaded] = useState(false);
  const [weekStartDate, setWeekStartDate] = useState<Date | null>(null);
  const [timetableDays, setTimetableDays] = useState<TimetableSlot[][]>(
    Array.from({length: 7}, () => []),
  );
  const [mounted, setMounted] = useState(true);
  const [courseNames, setCourseNames] = useState<string[]>(['', '', '']);

  const getCourseNames = (slots: TimetableSlot[]): string[] => {
    let _courseNames: string[] = [];
    slots.forEach(slot => {
      if (!_courseNames.includes(slot.course_name)) {
        _courseNames.push(slot.course_name);
      }
    });
    return _courseNames;
  };

  useEffect(() => {
    (async () => {
      let slots: TimetableSlot[] = [];
      try {
        slots = await getTimetable(deviceContext.device);
        setCourseNames(getCourseNames(slots));
        setLoaded(true);
      } catch (e) {
      } finally {
        if (!weekStartDate) {
          const date = moment(slots[0].start_time).startOf('week').toDate();
          setWeekStartDate(date);
        }
        let _timetableDays: TimetableSlot[][] = Array.from(
          {length: 7},
          () => [],
        );
        slots.forEach(slot => {
          _timetableDays[moment(slot.start_time).day()].push(slot);
        });
        setTimetableDays(_timetableDays);
      }
    })();
    return () => {
      setMounted(false);
    };
  }, []);

  return (
    <ScreenContainer>
      <View style={styles.withHorizontalPadding}>
        <ArrowHeader text={t('timetable')} backFunc={navigation.goBack} />
      </View>
      <View style={{...styles.paddingFromHeader}}>
        <View
          style={{
            ...styles.withHorizontalPadding,
            marginBottom: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Pressable
            style={{
              ...styles.border,
              borderWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 8,
              paddingVertical: 4,
              backgroundColor: colors.gradient1,
            }}>
            <MaterialIcons name="double-arrow" size={16} color={colors.white} />
            <TextS
              text="Jump to date"
              style={{marginLeft: 8}}
              color={colors.white}
            />
          </Pressable>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextS text="Layout:" />
            <View
              style={{
                marginLeft: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                ...styles.border,
                ...styles.elevated,
                backgroundColor: colors.white,
              }}>
              <MaterialCommunityIcons
                name="view-day-outline"
                size={24}
                style={{paddingLeft: 4}}
                color={colors.mediumGray}
              />
              <Pressable
                style={{
                  marginLeft: 4,
                  ...styles.border,
                  // borderColor: colors.gradient1,
                  // borderWidth: 1,
                  backgroundColor: colors.gradient1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 4,
                }}>
                <MaterialCommunityIcons
                  name="view-week-outline"
                  size={24}
                  color={colors.white}
                />
              </Pressable>
            </View>
          </View>
        </View>
        <View
          style={{
            ...styles.withHorizontalPadding,
            marginBottom: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={colors.gray}
          />
          <TextN text="Questa settimana" weight="medium" />
          <MaterialCommunityIcons
            name="arrow-right"
            size={24}
            color={colors.gray}
          />
        </View>
        <View
          style={{
            ...styles.withHorizontalPadding,
            marginLeft: 16,
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-around',
          }}>
          {loaded
            ? timetableDays.slice(1, 6).map((day, index) => (
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TextS
                    text={
                      weekStartDate
                        ? moment(weekStartDate).add(index, 'd').format('ddd')
                        : '??'
                    }
                  />
                  <TextS
                    key={index}
                    text={
                      weekStartDate
                        ? moment(weekStartDate).add(index, 'd').date()
                        : '??'
                    }
                  />
                </View>
              ))
            : null}
        </View>
        <View style={{flexDirection: 'row', marginHorizontal: 8}}>
          <View
            style={{
              position: 'absolute',
              width: '100%',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'stretch',
            }}>
            <View
              style={{
                height: 0,
                borderTopColor: colors.red,
                borderBottomColor: colors.red,
                backgroundColor: colors.red,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                zIndex: 100,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                transform: [
                  {
                    translateY:
                      h +
                      (moment
                        .duration(
                          moment().diff(
                            moment().set({
                              h: 8,
                              m: 0,
                            }),
                          ),
                        )
                        .as('ms') /
                        (3600 * 1000)) *
                        h,
                  },
                ],
              }}>
              <View
                style={{
                  backgroundColor: colors.red,
                  width: 8,
                  height: 8,
                  borderRadius: 16,
                }}></View>
            </View>
            {Array.from({length: 14}).map((_, index) => (
              <View
                style={{
                  width: '100%',
                  height: h,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-end',
                }}>
                <TextXS text={`${8 + index}:00`} />
                <View
                  style={{
                    width: '100%',
                    borderBottomWidth: 1,
                    borderColor: colors.lightGray,
                    height: h,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-end',
                  }}></View>
              </View>
            ))}
          </View>
        </View>
        <View
          style={{
            ...styles.withHorizontalPadding,
            marginLeft: 16,
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}>
          {loaded
            ? timetableDays.slice(1, 6).map((day, index) => (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'stretch',
                    borderLeftWidth: index > 0 ? 1 : 0,
                    borderColor: colors.lightGray,
                  }}>
                  <View>
                    {day.map(slot => (
                      <View
                        style={{
                          position: 'absolute',
                          overflow: 'hidden',
                          ...styles.border,
                          ...styles.elevatedSmooth,
                          padding: 4,
                          backgroundColor:
                            CourseColors[
                              courseNames.findIndex(
                                val => val == slot.course_name,
                              )
                            ],
                          height:
                            (moment
                              .duration(slot.end_time - slot.start_time)
                              .as('ms') /
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
                                  h,
                            },
                          ],
                        }}>
                        <TextXS text={slot.course_name} color={colors.white} />
                        <TextXS
                          text={slot.type}
                          color={colors.white}
                          style={{fontSize: 8}}
                        />
                        <TextXS
                          text={slot.room}
                          color={colors.white}
                          style={{fontSize: 8}}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              ))
            : null}
        </View>
      </View>
    </ScreenContainer>
  );
};

export default Timetable;

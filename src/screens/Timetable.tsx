import moment from 'moment';
import {getTimetable, TimetableSlot} from 'open-polito-api/timetable';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, View} from 'react-native';
import ArrowHeader from '../components/ArrowHeader';
import ScreenContainer from '../components/ScreenContainer';
import {DeviceContext} from '../context/Device';
import styles from '../styles';
import {useNavigation} from '@react-navigation/native';
import TimetableSlots from '../components/timetable/TimetableSlots';
import TimetableGrid from '../components/timetable/TimetableGrid';
import TimetableHeader from '../components/timetable/TimetableHeader';
import {useDispatch, useSelector} from 'react-redux';
import {setDialog} from '../store/sessionSlice';
import {DIALOG_TYPE} from '../types';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {AppDispatch} from '../store/store';
import Screen from '../ui/Screen';
import Header, {HEADER_TYPE} from '../ui/Header';
import {p} from '../scaling';

const Timetable = () => {
  const {t} = useTranslation();
  const {device, dark} = useContext(DeviceContext);
  const navigation = useNavigation();

  const dispatch = useDispatch<AppDispatch>();

  const [loaded, setLoaded] = useState(false);
  const [weekStartDate, setWeekStartDate] = useState<Date | null>(null);

  const [slots, setSlots] = useState<TimetableSlot[]>([]);

  /**
   * When slots change, update {@link timetableDays}
   */
  const timetableDays = useMemo(() => {
    let _timetableDays: TimetableSlot[][] = Array.from({length: 7}, () => []);
    slots.forEach(slot => {
      _timetableDays[moment(slot.start_time).day()].push(slot);
    });
    return _timetableDays;
  }, [slots]);

  const [layout, setLayout] = useState<'day' | 'week'>('day');

  const [mounted, setMounted] = useState(true);

  const [selectedDay, setSelectedDay] = useState(1); // Today's day index. TODO display first day of week when week is not current

  const [fetchTimer, setFetchTimer] = useState<any>(null);
  const [doUpdate, setDoUpdate] = useState<boolean>(false); // Flip it to trigger effect

  const offset = useSharedValue(0);
  const opacity = useSharedValue(0);
  const animStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, {duration: 500}),
      transform: [{translateX: offset.value}],
    };
  });

  /**
   * Controls the "scrolling" effect animation
   * @param direction left or right
   */
  const controlTransition = (direction: 'l' | 'r') => {
    opacity.value = withSequence(
      withTiming(0, {duration: 250}),
      withTiming(0, {duration: 500}),
      withTiming(1, {duration: 250}),
    );
    offset.value =
      direction === 'l'
        ? withSequence(
            withTiming(32, {duration: 750}),
            withTiming(-32, {duration: 0}),
            withTiming(0, {duration: 750}),
          )
        : withSequence(
            withTiming(-32, {duration: 750}),
            withTiming(32, {duration: 0}),
            withTiming(0, {duration: 750}),
          );
  };

  /**
   * Get slots and set {@link weekStartDate}
   */
  useEffect(() => {
    (async () => {
      if (!weekStartDate) controlTransition('r');
      if (fetchTimer) clearTimeout(fetchTimer);
      setFetchTimer(
        setTimeout(async () => {
          setLoaded(false);
          let slots: TimetableSlot[] = [];
          setSlots([]);
          try {
            slots = await getTimetable(device, weekStartDate ?? new Date());
            setLoaded(true);
          } catch (e) {
            // console.log(e);
          } finally {
            if (!weekStartDate) {
              const date = moment().startOf('isoWeek').toDate();
              mounted && setWeekStartDate(date);
            }
            setSlots(slots);
          }
        }, 250),
      );
    })();
    return () => {
      clearTimeout(fetchTimer);
      setMounted(false);
    };
  }, [doUpdate]);

  /**
   * Whether to show red line
   */
  const showLine: boolean = useMemo(() => {
    return (
      (layout === 'week' &&
        weekStartDate?.getTime() ===
          moment().startOf('isoWeek').toDate().getTime()) ||
      (layout === 'day' &&
        moment(weekStartDate)
          .add(selectedDay - 1, 'days')
          .toDate()
          .getTime() === moment().startOf('day').toDate().getTime())
    );
  }, [weekStartDate, selectedDay, layout]);

  return (
    <Screen>
      <Header headerType={HEADER_TYPE.MAIN} title={t('timetable')} />
      <View
        style={{
          flex: 1,
          paddingTop: 24 * p,
        }}>
        <View style={{paddingHorizontal: 16 * p}}>
          <TimetableHeader
            selectedDay={layout === 'week' ? null : selectedDay}
            onDayChanged={(value: number) => {
              setSelectedDay(value);
            }}
            onLayoutChanged={(value: 'day' | 'week') => {
              setLayout(value);
            }}
            weekStartDate={weekStartDate}
            onWeekStartDateChanged={(value: Date) => {
              if (weekStartDate && value.getTime() < weekStartDate.getTime()) {
                controlTransition('l');
              } else {
                controlTransition('r');
              }
              setWeekStartDate(moment(value).startOf('isoWeek').toDate());
              setDoUpdate(!doUpdate);
            }}
            timetableDays={timetableDays}
          />
        </View>
        <ScrollView style={{flex: 1}}>
          <Animated.View style={[animStyle, {flex: 1}]}>
            <TimetableGrid showLine={showLine} dark={dark} />
            <TimetableSlots
              loaded={loaded}
              timetableDays={timetableDays}
              layout={layout}
              selectedDay={selectedDay}
            />
          </Animated.View>
        </ScrollView>
      </View>
    </Screen>
  );
};

export default Timetable;

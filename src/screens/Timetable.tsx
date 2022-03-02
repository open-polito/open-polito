import moment from 'moment';
import {getTimetable, TimetableSlot} from 'open-polito-api/timetable';
import React, {useContext, useEffect, useState} from 'react';
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
import {RootState} from '../store/store';
import {Configuration} from '../defaultConfig';

const Timetable = () => {
  const {t} = useTranslation();
  const deviceContext = useContext(DeviceContext);
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const timetableConfig = useSelector<RootState, Configuration['timetable']>(
    state => state.session.config.timetable,
  );

  const [loaded, setLoaded] = useState(false);
  const [weekStartDate, setWeekStartDate] = useState<Date | null>(null);

  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [timetableDays, setTimetableDays] = useState<TimetableSlot[][]>(
    Array.from({length: 7}, () => []),
  );

  const [mounted, setMounted] = useState(true);

  /**
   * Get slots and set {@link weekStartDate}
   */
  useEffect(() => {
    (async () => {
      let slots: TimetableSlot[] = [];
      try {
        slots = await getTimetable(deviceContext.device);
        setLoaded(true);
      } catch (e) {
      } finally {
        if (!weekStartDate) {
          const date = moment(slots[0].start_time).startOf('isoWeek').toDate();
          mounted && setWeekStartDate(date);
        }
        setSlots(slots);
      }
    })();
    return () => {
      setMounted(false);
    };
  }, []);

  /**
   * When slots change, update {@link timetableDays}
   */
  useEffect(() => {
    let _timetableDays: TimetableSlot[][] = Array.from({length: 7}, () => []);
    slots.forEach(slot => {
      _timetableDays[moment(slot.start_time).day()].push(slot);
    });
    mounted && setTimetableDays(_timetableDays);
  }, [slots]);

  return (
    <ScreenContainer>
      <View style={styles.withHorizontalPadding}>
        <ArrowHeader
          text={t('timetable')}
          backFunc={navigation.goBack}
          optionsFunction={() => {
            dispatch(
              setDialog({
                visible: true,
                params: {type: DIALOG_TYPE.TIMETABLE_OPTIONS},
              }),
            );
          }}
        />
      </View>
      <View
        style={{
          ...styles.paddingFromHeader,
          flexDirection: 'column',
          flex: 1,
        }}>
        <TimetableHeader
          weekStartDate={weekStartDate}
          timetableDays={timetableDays}
        />
        <ScrollView>
          <View style={{flex: 1, paddingBottom: 32}}>
            <TimetableGrid />
            <TimetableSlots
              config={timetableConfig}
              timetableDays={timetableDays}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
};

export default Timetable;
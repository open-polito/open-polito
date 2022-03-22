import React, {useMemo} from 'react';
import {Pressable, View} from 'react-native';
import styles from '../../styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../colors';
import {TextN, TextS} from '../Text';
import {TimetableSlot} from 'open-polito-api/timetable';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import HorizontalIconSelector from '../HorizontalIconSelector';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const TimetableHeader = ({
  selectedDay = null,
  timetableDays,
  weekStartDate,
  onLayoutChanged,
  onDayChanged,
  onWeekStartDateChanged,
}: {
  selectedDay: number | null;
  timetableDays: TimetableSlot[][];
  weekStartDate: Date | null;
  onLayoutChanged: Function;
  onDayChanged: Function;
  onWeekStartDateChanged: Function;
}) => {
  const {t} = useTranslation();

  const _onLayoutChanged = (value: string) => {
    onLayoutChanged(value);
  };

  const _onDayChanged = (value: number) => {
    onDayChanged(value);
  };

  const _onWeekStartDateChanged = (value: Date) => {
    opacity.value = withSequence(
      withTiming(0, {duration: 250}),
      withTiming(1, {duration: 250}),
    );
    onWeekStartDateChanged(value);
  };

  const opacity = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => {
    return {opacity: opacity.value};
  });

  const headerTitle: string = useMemo(() => {
    const weekStartMoment = moment(weekStartDate);
    const weekEndMoment = moment(weekStartDate).add(4, 'day');
    return weekStartDate
      ? weekStartDate.getTime() == moment().startOf('w').toDate().getTime()
        ? t('thisWeek')
        : `${weekStartMoment.get('date')} ${
            weekStartMoment.get('month') != weekEndMoment.get('month')
              ? weekStartMoment.format('MMM ')
              : ''
          }${
            weekStartMoment.get('year') != weekEndMoment.get('year')
              ? weekStartMoment.format('YYYY ')
              : ''
          }- ${weekEndMoment.format('D MMM YYYY')}`
      : t('thisWeek');
  }, [weekStartDate]);

  return (
    <View style={{borderBottomWidth: 1, borderBottomColor: colors.lightGray}}>
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
            text={t('jumpToDate')}
            style={{marginLeft: 8}}
            color={colors.white}
          />
        </Pressable>
        <HorizontalIconSelector
          defaultValue="week"
          onValueChange={(value: string) => {
            _onLayoutChanged(value);
          }}
          label="Layout:"
          items={[
            {icon: 'view-day-outline', value: 'day'},
            {icon: 'view-week-outline', value: 'week'},
          ]}
        />
      </View>
      <View
        style={{
          ...styles.withHorizontalPadding,
          marginBottom: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Pressable
          onPress={() =>
            _onWeekStartDateChanged(
              moment(weekStartDate).subtract(1, 'w').toDate(),
            )
          }>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={colors.gray}
          />
        </Pressable>
        <Animated.View style={[animStyle]}>
          <TextN text={headerTitle} weight="medium" />
        </Animated.View>
        <Pressable
          onPress={() =>
            _onWeekStartDateChanged(moment(weekStartDate).add(1, 'w').toDate())
          }>
          <MaterialCommunityIcons
            name="arrow-right"
            size={24}
            color={colors.gray}
          />
        </Pressable>
      </View>
      <View
        style={{
          ...styles.withHorizontalPadding,
          marginLeft: 12,
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-around',
          paddingBottom: 12,
        }}>
        {timetableDays.slice(1, 6).map((day, index) => (
          <Pressable
            onPress={() => {
              _onDayChanged(index + 1);
            }}
            key={index}
            style={{
              opacity: weekStartDate ? 1 : 0,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 4,
              backgroundColor:
                selectedDay == index + 1 ? colors.gradient1 : colors.white,
            }}>
            <TextS
              text={
                weekStartDate
                  ? moment(weekStartDate).add(index, 'd').format('ddd')
                  : ''
              }
              color={selectedDay == index + 1 ? colors.white : colors.black}
            />
            <TextS
              key={index}
              text={
                weekStartDate
                  ? moment(weekStartDate).add(index, 'd').date()
                  : ''
              }
              color={selectedDay == index + 1 ? colors.white : colors.black}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default TimetableHeader;

import React, {useContext, useMemo} from 'react';
import {Pressable, View} from 'react-native';
import colors from '../../colors';
import {TimetableSlot} from 'open-polito-api/lib/timetable';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import Toggles from '../../ui/HorizontalIconSelector';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Text from '../../ui/core/Text';
import {DeviceContext} from '../../context/Device';
import {p} from '../../scaling';
import Button from '../../ui/core/Button';
import TablerIcon from '../../ui/core/TablerIcon';
// import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ModalContext} from '../../context/ModalProvider';
import TimetableOptionsModal from '../modals/TimetableOptionsModal';

const showDatePicker = (callback: (date: number | undefined) => any) => {
  // TODO UNCOMMENT
  // DateTimePickerAndroid.open({
  //   mode: 'date',
  //   value: new Date(),
  //   onChange: date => callback(date.nativeEvent.timestamp),
  // });
};

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

  const {dark} = useContext(DeviceContext);
  const {setModal} = useContext(ModalContext);

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
  }, [weekStartDate, t]);

  return (
    <View style={{borderBottomWidth: 1 * p, borderBottomColor: colors.gray200}}>
      <View
        style={{
          marginBottom: 16 * p,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Button
          secondary
          small
          text={t('jumpToDate')}
          icon="chevrons-right"
          onPress={() =>
            showDatePicker(date => {
              if (!date) return;
              _onWeekStartDateChanged(new Date(date));
            })
          }
        />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Toggles
            defaultValue="week"
            onValueChange={(value: string) => {
              _onLayoutChanged(value);
            }}
            label="Layout:"
            items={[
              {icon: 'layout-rows', value: 'day'},
              {icon: 'layout-columns', value: 'week'},
            ]}
            dark={dark}
          />
          <TouchableOpacity style={{marginLeft: 24 * p}}>
            <TablerIcon
              onPress={() => setModal(<TimetableOptionsModal />)}
              name="settings"
              size={20 * p}
              color={dark ? colors.gray100 : colors.gray800}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          marginBottom: 16 * p,
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
          <TablerIcon
            name="arrow-left"
            size={24 * p}
            color={dark ? colors.gray100 : colors.gray800}
          />
        </Pressable>
        <Animated.View style={[animStyle]}>
          <Text c={dark ? colors.gray100 : colors.gray800} s={12 * p} w="m">
            {headerTitle}
          </Text>
        </Animated.View>
        <Pressable
          onPress={() =>
            _onWeekStartDateChanged(moment(weekStartDate).add(1, 'w').toDate())
          }>
          <TablerIcon
            name="arrow-right"
            size={24 * p}
            color={dark ? colors.gray100 : colors.gray800}
          />
        </Pressable>
      </View>
      <View
        style={{
          // ...styles.withHorizontalPadding,
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
                selectedDay == index + 1
                  ? colors.accent300
                  : dark
                  ? colors.gray700
                  : colors.gray200,
            }}>
            <Text
              s={10 * p}
              w="r"
              c={
                selectedDay == index + 1
                  ? colors.gray100
                  : dark
                  ? colors.gray100
                  : colors.gray800
              }>
              {weekStartDate
                ? moment(weekStartDate).add(index, 'd').format('ddd')
                : ''}
            </Text>
            <Text
              s={10 * p}
              w="r"
              c={
                selectedDay == index + 1
                  ? colors.gray100
                  : dark
                  ? colors.gray100
                  : colors.gray700
              }
              key={index}>
              {weekStartDate
                ? moment(weekStartDate).add(index, 'd').date()
                : ''}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default TimetableHeader;

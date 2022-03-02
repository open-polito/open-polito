import React from 'react';
import {Pressable, View} from 'react-native';
import styles from '../../styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../colors';
import {TextN, TextS} from '../Text';
import {TimetableSlot} from 'open-polito-api/timetable';
import moment from 'moment';
import {useTranslation} from 'react-i18next';

const TimetableHeader = ({
  timetableDays,
  weekStartDate,
}: {
  timetableDays: TimetableSlot[][];
  weekStartDate: Date | null;
}) => {
  const {t} = useTranslation();

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
        <TextN text={t('thisWeek')} weight="medium" />
        <MaterialCommunityIcons
          name="arrow-right"
          size={24}
          color={colors.gray}
        />
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
          <View
            key={index}
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextS
              text={
                weekStartDate
                  ? moment(weekStartDate).add(index, 'd').format('ddd')
                  : ''
              }
            />
            <TextS
              key={index}
              text={
                weekStartDate
                  ? moment(weekStartDate).add(index, 'd').date()
                  : ''
              }
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default TimetableHeader;

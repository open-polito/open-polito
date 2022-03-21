import React, {useEffect, useState} from 'react';
import colors, {courseColors} from '../../colors';
import {TextXS} from '../Text';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {TimetableSlot} from 'open-polito-api/timetable';
import moment from 'moment';
import {View} from 'react-native';
import styles from '../../styles';

const TimetableEvent = ({
  overlapGroup,
  slot,
  w,
  h,
  courseNames,
  index,
}: {
  overlapGroup: TimetableSlot[];
  slot: TimetableSlot;
  w: number;
  h: number;
  courseNames: string[];
  index: number;
}) => {
  const offset = useSharedValue(0);

  const [width, setWidth] = useState(0);

  useEffect(() => {
    offset.value = w;
  }, [w]);

  const animStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(
        overlapGroup.length > 0
          ? offset.value / overlapGroup.length
          : offset.value,
        {duration: 250},
      ),
      left: withTiming(
        overlapGroup.length > 0
          ? index * (offset.value / overlapGroup.length)
          : 0,
        {duration: 250},
      ),
    };
  });

  return (
    <Animated.View
      onLayout={e => setWidth(e.nativeEvent.layout.width)}
      style={[
        {
          overflow: 'hidden',
          position: 'absolute',

          top:
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

          ...styles.border,
          ...styles.elevatedSmooth,
          padding: 4,
          backgroundColor:
            courseColors[courseNames.findIndex(val => val == slot.course_name)],
          height:
            (moment.duration(slot.end_time - slot.start_time).as('ms') /
              (3600 * 1000)) *
            h,
        },
        animStyle,
      ]}>
      {width >= 25 ? (
        <TextXS
          text={slot.course_name}
          color={colors.white}
          numberOfLines={2}
        />
      ) : null}
      {width >= 60 ? (
        <>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 8,
              alignItems: 'center',
              justifyContent: 'flex-start',
              overflow: 'hidden',
            }}>
            <MaterialIcons name="place" size={12} color={colors.lightGray} />
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
        </>
      ) : null}
    </Animated.View>
  );
};

export default TimetableEvent;

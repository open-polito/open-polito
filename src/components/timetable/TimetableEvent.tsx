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
import {Pressable, View} from 'react-native';
import styles from '../../styles';
import {useDispatch} from 'react-redux';
import {setDialog} from '../../store/sessionSlice';
import {DIALOG_TYPE, TimetableEventDialogParams} from '../../types';

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
  const dispatch = useDispatch();

  const offset = useSharedValue(0);
  const opacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  const [width, setWidth] = useState(0);

  useEffect(() => {
    opacity.value = 1;
  }, []);

  useEffect(() => {
    offset.value = w;
    if (w >= 60) {
      setTimeout(() => {
        textOpacity.value = 1;
      }, 100);
    }
  }, [w]);

  const animTextSectionStyle = useAnimatedStyle(() => {
    return {opacity: withTiming(textOpacity.value, {duration: 500})};
  });

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
          backgroundColor:
            courseColors[courseNames.findIndex(val => val == slot.course_name)],
          height:
            (moment.duration(slot.end_time - slot.start_time).as('ms') /
              (3600 * 1000)) *
            h,
        },
        animStyle,
      ]}>
      <Pressable
        style={{
          flex: 1,
          padding: 4,
        }}
        android_ripple={{color: colors.white}}
        onPress={() => {
          dispatch(
            setDialog({
              visible: true,
              params: {
                type: DIALOG_TYPE.TIMETABLE_EVENT,
                slot: slot,
              } as TimetableEventDialogParams,
            }),
          );
        }}>
        {width >= 25 ? (
          <Animated.View style={[animTextSectionStyle]}>
            <TextXS
              text={slot.course_name}
              color={colors.white}
              numberOfLines={2}
            />
          </Animated.View>
        ) : null}
        {width >= 60 ? (
          <Animated.View style={[animTextSectionStyle]}>
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
                opacity: opacity.value,
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
          </Animated.View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
};

export default TimetableEvent;

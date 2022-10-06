import React, {useContext, useEffect, useState} from 'react';
import colors, {courseColors} from '../../colors';
import {TextXS} from '../Text';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {TimetableSlot} from 'open-polito-api/timetable';
import moment from 'moment';
import {TouchableOpacity, View} from 'react-native';
import {p} from '../../scaling';
import Text from '../../ui/core/Text';
import TablerIcon from '../../ui/core/TablerIcon';
import {ModalContext} from '../../context/ModalProvider';
import TimetableEventModal from '../modals/TimetableEventModal';

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
  const {setModal} = useContext(ModalContext);

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

          borderRadius: 4 * p,
          backgroundColor:
            courseColors[courseNames.findIndex(val => val == slot.course_name)],
          height:
            (moment.duration(slot.end_time - slot.start_time).as('ms') /
              (3600 * 1000)) *
            h,
        },
        animStyle,
      ]}>
      <TouchableOpacity
        style={{
          flex: 1,
          padding: 4 * p,
        }}
        onPress={() => {
          setModal(<TimetableEventModal slot={slot} />);
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
                marginTop: 8 * p,
                alignItems: 'center',
                justifyContent: 'flex-start',
                overflow: 'hidden',
              }}>
              <TablerIcon name="map-pin" size={8 * p} color={colors.gray50} />
              <Text
                w="r"
                s={8 * p}
                c={colors.gray50}
                numberOfLines={2}
                style={{marginLeft: 2 * p}}>
                {slot.room}
              </Text>
            </View>
            <View
              style={{
                opacity: opacity.value,
                flexDirection: 'row',
                marginTop: 4 * p,
                alignItems: 'center',
                justifyContent: 'flex-start',
                overflow: 'hidden',
              }}>
              <TablerIcon name="list" size={8 * p} color={colors.gray50} />
              <Text
                w="r"
                s={8 * p}
                c={colors.gray50}
                numberOfLines={2}
                style={{marginLeft: 2 * p}}>
                {slot.type}
              </Text>
            </View>
          </Animated.View>
        ) : null}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TimetableEvent;

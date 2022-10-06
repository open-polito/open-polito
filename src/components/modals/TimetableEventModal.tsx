import React, {FC, useContext, useMemo} from 'react';
import {View} from 'react-native';
import colors from '../../colors';
import moment from 'moment';
import TablerIcon from '../../ui/core/TablerIcon';
import {p} from '../../scaling';
import {DeviceContext} from '../../context/Device';
import Text from '../../ui/core/Text';
import ModalBase from './ModalBase';
import {TimetableSlot} from 'open-polito-api/timetable';

const TimetableEventModal: FC<{slot: TimetableSlot}> = ({slot}) => {
  const {dark} = useContext(DeviceContext);

  const items: {icon: string; name: string}[] = useMemo(() => {
    return [
      {
        icon: 'map-pin',
        name: slot.room,
      },
      {
        icon: 'align-justified',
        name: slot.type,
      },
      {
        icon: 'clock',
        name:
          moment(slot.start_time).format('HH:mm') +
          ' - ' +
          moment(slot.end_time).format('HH:mm') +
          ' (' +
          moment(slot.start_time).format('ll') +
          ')',
      },
      {
        icon: 'user',
        name: slot.professor.surname + ' ' + slot.professor.name,
      },
    ];
  }, [slot]);

  return (
    <ModalBase title={slot.course_name}>
      {items.map((item, i) => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginTop: (i == 0 ? 0 : 8) * p,
          }}>
          <TablerIcon
            name={item.icon}
            size={16 * p}
            color={dark ? colors.gray300 : colors.gray600}
            style={{marginRight: 8 * p}}
          />
          <Text s={12 * p} c={dark ? colors.gray100 : colors.gray800} w="r">
            {item.name}
          </Text>
        </View>
      ))}
    </ModalBase>
  );
};

export default TimetableEventModal;

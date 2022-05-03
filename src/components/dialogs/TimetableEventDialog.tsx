import React, {FC, useMemo} from 'react';
import {View} from 'react-native';
import styles from '../../styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TimetableEventDialogParams} from '../../types';
import colors from '../../colors';
import {TextL, TextN, TextS, TextSubTitle, TextTitle, TextXL} from '../Text';
import {useTranslation} from 'react-i18next';
import moment from 'moment';

const TimetableEventDialog: FC<TimetableEventDialogParams> = ({slot}) => {
  const {t} = useTranslation();

  const items: {icon: string; name: string}[] = useMemo(() => {
    return [
      {
        icon: 'place',
        name: slot.room,
      },
      {
        icon: 'short-text',
        name: slot.type,
      },
      {
        icon: 'access-time',
        name:
          moment(slot.start_time).format('HH:mm') +
          ' - ' +
          moment(slot.end_time).format('HH:mm') +
          ' (' +
          moment(slot.start_time).format('ll') +
          ')',
      },
      {
        icon: 'person-outline',
        name: slot.professor.surname + ' ' + slot.professor.name,
      },
    ];
  }, [slot]);

  return (
    <View style={{...styles.withHorizontalPadding, paddingBottom: 16}}>
      {items.map(item => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginTop: 8,
          }}>
          <MaterialIcons
            name={item.icon}
            size={20}
            color={colors.gray}
            style={{marginRight: 8}}
          />
          <TextN text={item.name} />
        </View>
      ))}
    </View>
  );
};

export default TimetableEventDialog;

import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Configuration} from '../../defaultConfig';
import {setConfig} from '../../store/sessionSlice';
import {AppDispatch, RootState} from '../../store/store';
import styles from '../../styles';
import {TimetableOptionsDialogParams} from '../../types';
import ListRank from '../ListRank';
import SettingsItem, {SettingsItemProps} from '../../ui/SettingsItem';

const TimetableOptionsDialog = ({}: TimetableOptionsDialogParams) => {
  const dispatch = useDispatch<AppDispatch>();
  const {t} = useTranslation();

  const config = useSelector<RootState, Configuration>(
    state => state.session.config,
  );

  const rankItems = useMemo(() => {
    return config.timetable.priority.map(item => {
      return {label: item, value: item};
    });
  }, [config.timetable.priority]);

  const updateTimetableConfig = (params: Configuration['timetable']) => {
    dispatch(
      setConfig({...config, timetable: {...config.timetable, ...params}}),
    );
  };

  const toggleOverlapMode = () => {
    const mode: Configuration['timetable']['overlap'] =
      config.timetable?.overlap == 'split' ? 'priority' : 'split';
    updateTimetableConfig({...config.timetable, overlap: mode});
  };

  const timetableOptionsItems: SettingsItemProps[] = [
    {
      name: t('timetablePriority'),
      description: t('timetablePriorityDesc'),
      icon: 'priority-high',
      toggle: true,
      toggleValue: config.timetable.overlap == 'priority',
      settingsFunction: () => {
        toggleOverlapMode();
      },
    },
    {
      name: t('timetablePriorityList'),
      settingsFunction: () => {},
      disabled: config.timetable.overlap != 'priority',
      children: (
        <ListRank
          disabled={config.timetable.overlap != 'priority'}
          items={rankItems}
          callback={data => {
            updateTimetableConfig({...config.timetable, priority: data});
          }}
        />
      ),
    },
  ];

  return (
    <View
      style={{
        ...styles.withHorizontalPadding,
      }}>
      <FlatList
        data={timetableOptionsItems}
        keyExtractor={item => item.name}
        renderItem={item => <SettingsItem {...item.item} />}
      />
    </View>
  );
};

export default TimetableOptionsDialog;

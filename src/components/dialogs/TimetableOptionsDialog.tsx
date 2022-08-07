import React, {useContext, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Configuration} from '../../defaultConfig';
import {setConfig} from '../../store/sessionSlice';
import {AppDispatch, RootState} from '../../store/store';
import {TimetableOptionsDialogParams} from '../../types';
import ListRank from '../ListRank';
import SettingsItem, {SettingsItemProps} from '../../ui/SettingsItem';
import {DeviceContext} from '../../context/Device';

const TimetableOptionsDialog = ({}: TimetableOptionsDialogParams) => {
  const dispatch = useDispatch<AppDispatch>();
  const {t} = useTranslation();
  const {dark} = useContext(DeviceContext);

  const config = useSelector<RootState, Configuration>(
    state => state.session.config,
  );

  const rankItems = useMemo(() => {
    return config.timetablePriority.map(item => {
      return {label: item, value: item};
    });
  }, [config.timetablePriority]);

  const toggleOverlapMode = () => {
    const mode: Configuration['timetableOverlap'] =
      config.timetableOverlap === 'split' ? 'priority' : 'split';
    dispatch(setConfig({...config, timetableOverlap: mode}));
  };

  const timetableOptionsItems: SettingsItemProps[] = [
    {
      name: t('timetablePriority'),
      description: t('timetablePriorityDesc'),
      icon: 'stack-2',
      toggle: true,
      toggleValue: config.timetableOverlap === 'priority',
      settingsFunction: toggleOverlapMode,
      padding: true,
    },
    {
      name: t('timetablePriorityList'),
      settingsFunction: () => {},
      disabled: config.timetableOverlap !== 'priority',
      children: (
        <ListRank
          dark={dark}
          disabled={config.timetableOverlap !== 'priority'}
          items={rankItems}
          callback={data =>
            dispatch(
              setConfig({
                ...config,
                timetablePriority: data.filter(d => d !== ''),
              }),
            )
          }
        />
      ),
      padding: true,
      paddingBottom: false,
    },
  ];

  return (
    <View>
      <FlatList
        data={timetableOptionsItems}
        keyExtractor={item => item.name}
        renderItem={item => <SettingsItem {...item.item} />}
      />
    </View>
  );
};

export default TimetableOptionsDialog;

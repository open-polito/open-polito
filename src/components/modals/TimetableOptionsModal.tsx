import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Configuration} from '../../defaultConfig';
import {setConfig} from '../../store/sessionSlice';
import {AppDispatch, RootState} from '../../store/store';
import ListRank from '../ListRank';
import SettingsItem, {SettingsItemProps} from '../../ui/SettingsItem';
import {DeviceContext} from '../../context/Device';
import ModalBase from './ModalBase';
import colors from '../../colors';

const TimetableOptionsModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {t} = useTranslation();
  const {dark} = useContext(DeviceContext);

  const [showListRank, setShowListRank] = useState(false);

  //  Ugly hack to make the modal actually show.
  //  If I render the children elements immediately,
  //  for some reason the whole modal won't render.
  //  The problem seems to be caused by the draggable elements,
  //  but for now this fix does the job.
  useEffect(() => {
    setTimeout(() => setShowListRank(true), 0);
  }, []);

  const config = useSelector<RootState, Configuration>(
    state => state.session.config,
  );

  const rankItems = useMemo(() => {
    return config.timetablePriority.map(item => {
      return {label: item, value: item};
    });
  }, [config]);

  const toggleOverlapMode = useCallback(() => {
    const mode: Configuration['timetableOverlap'] =
      config.timetableOverlap === 'split' ? 'priority' : 'split';
    dispatch(setConfig({...config, timetableOverlap: mode}));
  }, [config, dispatch]);

  const timetableOptionsItems = useMemo<SettingsItemProps[]>(() => {
    return [
      {
        name: t('timetablePriority'),
        description: t('timetablePriorityDesc'),
        icon: 'stack-2',
        toggle: true,
        toggleValue: config.timetableOverlap === 'priority',
        settingsFunction: toggleOverlapMode,
      },
      {
        name: t('timetablePriorityList'),
        settingsFunction: () => {},
        disabled: config.timetableOverlap !== 'priority',
        children: (
          <View>
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
          </View>
        ),
        paddingBottom: false,
      },
    ];
  }, [config, dark, dispatch, rankItems, t, toggleOverlapMode]);

  return (
    <ModalBase title={t('timetableOptions')}>
      <View>
        {showListRank ? (
          timetableOptionsItems.map(item => (
            <SettingsItem key={item.name} {...item} />
          ))
        ) : (
          <ActivityIndicator color={colors.accent300} />
        )}
      </View>
    </ModalBase>
  );
};

export default TimetableOptionsModal;

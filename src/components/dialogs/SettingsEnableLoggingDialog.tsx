import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {RenderHTMLSource} from 'react-native-render-html';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../colors';
import {DeviceContext} from '../../context/Device';
import {Configuration} from '../../defaultConfig';
import {p} from '../../scaling';
import {setConfig, setDialog, setToast} from '../../store/sessionSlice';
import {AppDispatch, RootState} from '../../store/store';
import Button from '../../ui/core/Button';
import TablerIcon from '../../ui/core/TablerIcon';
import Text from '../../ui/core/Text';
import Logger from '../../utils/Logger';

const SettingsEnableLoggingDialog = () => {
  const {dark} = useContext(DeviceContext);
  const {t} = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const config = useSelector<RootState, Configuration>(
    state => state.session.config,
  );

  const closeDialog = () => {
    dispatch(setDialog({visible: false, params: null}));
  };

  const enableLogging = () => {
    dispatch(setConfig({...config, logging: !config.logging}));
    dispatch(
      setToast({
        message: t('restartFlashMessage'),
        type: 'warn',
        visible: true,
      }),
    );
  };

  return (
    <View style={{paddingHorizontal: 16 * p}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View style={{marginRight: 8 * p}}>
          <TablerIcon name="alert-triangle" color={colors.red} size={24 * p} />
        </View>
        <Text s={16} w="m" c={dark ? colors.gray100 : colors.gray800}>
          {t('debugEnableLogging')}
        </Text>
      </View>
      <View style={{marginTop: 24 * p}}>
        <RenderHTMLSource
          source={{
            html: t('debugEnableLoggingDialogMessage', {
              path: Logger.logsDirectoryPath,
            }),
          }}
        />
      </View>
      <View style={{marginTop: 24 * p, flexDirection: 'row'}}>
        <View style={{flex: 1}}>
          <Button secondary text={t('cancel')} onPress={closeDialog} />
        </View>
        <View style={{width: 16 * p}}></View>
        <View style={{flex: 1}}>
          <Button
            color={colors.red}
            text={t('confirm')}
            onPress={() => {
              enableLogging();
              closeDialog();
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default SettingsEnableLoggingDialog;

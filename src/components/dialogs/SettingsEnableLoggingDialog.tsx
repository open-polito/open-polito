import React from 'react';
import {useTranslation} from 'react-i18next';
import {RenderHTMLSource} from 'react-native-render-html';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../colors';
import {Configuration} from '../../defaultConfig';
import {setConfig, setToast} from '../../store/sessionSlice';
import {AppDispatch, RootState} from '../../store/store';
import Logger from '../../utils/Logger';
import BaseActionConfirmDialog from './BaseActionConfirmDialog';

const SettingsEnableLoggingDialog = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const config = useSelector<RootState, Configuration>(
    state => state.session.config,
  );

  const enableLogging = () => {
    dispatch(setConfig({...config, logging: !config.logging}));
    dispatch(
      setToast({
        message: t('restartToastMessage'),
        type: 'warn',
        visible: true,
      }),
    );
  };

  return (
    <BaseActionConfirmDialog
      title={t('debugEnableLogging')}
      icon="alert-triangle"
      accentColor={colors.red}
      onConfirm={enableLogging}>
      <RenderHTMLSource
        source={{
          html: t('debugEnableLoggingDialogMessage', {
            path: Logger.logsDirectoryPath,
          }),
        }}
      />
    </BaseActionConfirmDialog>
  );
};

export default SettingsEnableLoggingDialog;

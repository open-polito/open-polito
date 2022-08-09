import React, {useContext} from 'react';
import i18next, {t} from 'i18next';
import colors from '../../colors';
import {ExamsCancelExamDialogParams} from '../../types';
import BaseActionConfirmDialog from './BaseActionConfirmDialog';
import {RenderHTMLSource} from 'react-native-render-html';
import moment from 'moment';
import {Device} from 'open-polito-api/device';
import {ExamSession} from 'open-polito-api/exam_sessions';
import {cancelExamSession} from 'open-polito-api/exam_sessions';
import store from '../../store/store';
import {setToast} from '../../store/sessionSlice';
import {DeviceContext} from '../../context/Device';

const cancelExamSync = (
  device: Device,
  examSession: ExamSession,
  callback: () => any = () => {},
) => {
  (async () => {
    let success: boolean = false;
    try {
      await cancelExamSession(
        device,
        examSession.session_id,
        examSession.course_id,
      );
      success = true;
    } catch (e) {
      console.log(e);
    } finally {
      store.dispatch(
        setToast({
          visible: true,
          message: i18next.t(
            success
              ? 'examsExamCanceledToastMessage'
              : 'examsExamCancelingErrorToastMessage',
          ),
          type: success ? 'success' : 'err',
        }),
      );
      callback();
    }
  })();
};

const ExamsCancelExamDialog = ({...params}: ExamsCancelExamDialogParams) => {
  const {device} = useContext(DeviceContext);
  return (
    <BaseActionConfirmDialog
      title={t('cancelExamBooking')}
      accentColor={colors.red}
      icon="alert-triangle"
      onConfirm={() => cancelExamSync(device, params.examSession)}>
      <RenderHTMLSource
        source={{
          html: t('cancelExamBookingDialogMessage', {
            code: params.examSession.course_id,
            name: params.examSession.exam_name,
            date: moment(params.examSession.date).format('lll'),
            rooms: params.examSession.rooms,
          }),
        }}
      />
    </BaseActionConfirmDialog>
  );
};

export default ExamsCancelExamDialog;

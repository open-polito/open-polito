import React, {useContext} from 'react';
import i18next, {t} from 'i18next';
import colors from '../../colors';
import BaseActionConfirmModal from './BaseActionConfirmModal';
import {RenderHTMLSource} from 'react-native-render-html';
import moment from 'moment';
import {Device} from 'open-polito-api/lib/device';
import {ExamSession} from 'open-polito-api/lib/exam_sessions';
import {cancelExamSession} from 'open-polito-api/lib/exam_sessions';
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

const ExamsCancelExamModal = ({examSession}: {examSession: ExamSession}) => {
  const {device} = useContext(DeviceContext);
  return (
    <BaseActionConfirmModal
      title={t('cancelExamBooking')}
      accentColor={colors.red}
      icon="alert-triangle"
      onConfirm={() => cancelExamSync(device, examSession)}>
      <RenderHTMLSource
        source={{
          html: t('cancelExamBookingDialogMessage', {
            code: examSession.course_id,
            name: examSession.exam_name,
            date: moment(examSession.date).format('lll'),
            rooms: examSession.rooms,
          }),
        }}
      />
    </BaseActionConfirmModal>
  );
};

export default ExamsCancelExamModal;

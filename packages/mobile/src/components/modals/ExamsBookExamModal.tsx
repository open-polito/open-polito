import React, {useContext} from 'react';
import i18next, {t} from 'i18next';
import BaseActionConfirmModal from './BaseActionConfirmModal';
import {RenderHTMLSource} from 'react-native-render-html';
import moment from 'moment';
import {bookExamSession, ExamSession} from 'open-polito-api/lib/exam_sessions';
import {Device} from 'open-polito-api/lib/device';
import {DeviceContext} from '../../context/Device';
import store from '../../store/store';
import {setToast} from '../../store/sessionSlice';

const bookExamSync = (
  device: Device,
  examSession: ExamSession,
  callback: () => any = () => {},
) => {
  (async () => {
    let success: boolean = false;
    try {
      await bookExamSession(
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
              ? 'examsExamBookedToastMessage'
              : 'examsExamBookingErrorToastMessage',
          ),
          type: success ? 'success' : 'err',
        }),
      );
      callback();
    }
  })();
};

const ExamsBookExamModal = ({examSession}: {examSession: ExamSession}) => {
  const {device} = useContext(DeviceContext);
  return (
    <BaseActionConfirmModal
      title={t('confirmExamBooking')}
      onConfirm={() => bookExamSync(device, examSession)}>
      <RenderHTMLSource
        source={{
          html: t('confirmExamBookingDialogMessage', {
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

export default ExamsBookExamModal;

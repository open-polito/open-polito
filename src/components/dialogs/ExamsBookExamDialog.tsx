import React, {useContext} from 'react';
import i18next, {t} from 'i18next';
import colors from '../../colors';
import {ExamsBookExamDialogParams} from '../../types';
import BaseActionConfirmDialog from './BaseActionConfirmDialog';
import {RenderHTMLSource} from 'react-native-render-html';
import moment from 'moment';
import {bookExamSession, ExamSession} from 'open-polito-api/exam_sessions';
import {Device} from 'open-polito-api/device';
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

const ExamsBookExamDialog = ({...params}: ExamsBookExamDialogParams) => {
  const {device} = useContext(DeviceContext);
  return (
    <BaseActionConfirmDialog
      title={t('confirmExamBooking')}
      accentColor={colors.green}
      onConfirm={() => bookExamSync(device, params.examSession)}>
      <RenderHTMLSource
        source={{
          html: t('confirmExamBookingDialogMessage', {
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

export default ExamsBookExamDialog;

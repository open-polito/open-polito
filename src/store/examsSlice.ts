/**
 * @file Manages actions and state related to exam sessions and exam bookings
 */

import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Device} from 'open-polito-api/device';
import {ExamSession, getExamSessions} from 'open-polito-api/exam_sessions';
import {
  errorStatus,
  initialStatus,
  pendingStatus,
  shouldWaitForCooldown,
  Status,
  successStatus,
} from './status';
import {RootState} from './store';

export type ExamsState = {
  exams: ExamSession[];
  getExamsStatus: Status;
};

const initialState: ExamsState = {
  exams: [],
  getExamsStatus: initialStatus,
};

/**
 * Gets exam sessions. Returns {@link ExamSession[]}
 */
export const getExams = createAsyncThunk<
  ExamSession[],
  Device,
  {state: RootState}
>(
  'exams/getExams',
  async (device, {dispatch, getState}) => {
    const exams = await getExamSessions(device);
    return exams;
  },
  {
    condition: (_, {getState}) =>
      !shouldWaitForCooldown(getState().exams.getExamsStatus),
  },
);

export const examsSlice = createSlice({
  name: 'exams',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getExams.pending, state => {
        state.getExamsStatus = pendingStatus();
      })
      .addCase(getExams.fulfilled, (state, {payload}) => {
        state.exams = payload;
        state.getExamsStatus = successStatus();
      })
      .addCase(getExams.rejected, (state, {error}) => {
        state.getExamsStatus = errorStatus(error);
      });
  },
});

export const {} = examsSlice.actions;

export default examsSlice.reducer;

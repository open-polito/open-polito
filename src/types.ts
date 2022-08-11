import {Notice} from 'open-polito-api/course';
import {ExamSession} from 'open-polito-api/exam_sessions';
import {File} from 'open-polito-api/material';
import {TimetableSlot} from 'open-polito-api/timetable';

/**
 * Extends the API's File type by adding some course data
 */
export type ExtendedFile = File & {
  course_name: string;
  course_code: string;
};

/**
 * Extends the API's Notice type
 */
export type ExtendedAlert = Notice & {
  course_name: string;
  course_code: string;
};

export type DropdownItem = {
  label: string;
  value: string;
};

export type SearchFilterParams = {
  type: '' | 'COURSE';
  selected: string;
};

export type DialogParamsBase = {
  title?: string;
  type: string;
};

export type ListSelectorDialogParams = DialogParamsBase & {
  type: 'LIST_SELECTOR';
  selectorType: 'SEARCH_FILTER';
};

export type TimetableOptionsDialogParams = DialogParamsBase & {
  type: 'TIMETABLE_OPTIONS';
};

export type TimetableEventDialogParams = DialogParamsBase & {
  type: 'TIMETABLE_EVENT';
  slot: TimetableSlot;
};

export type NotificationsDialogParams = DialogParamsBase & {
  type: 'NOTIFICATIONS';
};

export type SettingsEnableLoggingDialogParams = DialogParamsBase & {
  type: 'SETTINGS_ENABLE_LOGGING';
};

export type ExamsBookExamDialogParams = DialogParamsBase & {
  type: 'EXAMS_BOOK_EXAM';
  examSession: ExamSession;
};

export type ExamsCancelExamDialogParams = DialogParamsBase & {
  type: 'EXAMS_CANCEL_EXAM';
  examSession: ExamSession;
};

export type DialogParams =
  | ListSelectorDialogParams
  | TimetableOptionsDialogParams
  | TimetableEventDialogParams
  | NotificationsDialogParams
  | SettingsEnableLoggingDialogParams
  | ExamsBookExamDialogParams
  | ExamsCancelExamDialogParams;

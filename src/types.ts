import {Notice} from 'open-polito-api/course';
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

export type DialogParamsBase = {
  title?: string;
  type: string;
};

export type ListSelectorDialogParams = DialogParamsBase & {
  type: 'LIST_SELECTOR';
  items: [];
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

export type DialogParams =
  | ListSelectorDialogParams
  | TimetableOptionsDialogParams
  | TimetableEventDialogParams
  | NotificationsDialogParams
  | SettingsEnableLoggingDialogParams;

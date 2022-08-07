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

export enum DIALOG_TYPE {
  LIST_SELECTOR = 'LIST_SELECTOR',
  TIMETABLE_OPTIONS = 'TIMETABLE_OPTIONS',
  TIMETABLE_EVENT = 'TIMETABLE_EVENT',
  NOTIFICATIONS = 'NOTIFICATIONS',
}

export type DialogParamsBase = {
  title?: string;
  type: DIALOG_TYPE;
};

export type ListSelectorDialogParams = DialogParamsBase & {
  type: DIALOG_TYPE.LIST_SELECTOR;
  items: [];
};

export type TimetableOptionsDialogParams = DialogParamsBase & {
  type: DIALOG_TYPE.TIMETABLE_OPTIONS;
};

export type TimetableEventDialogParams = DialogParamsBase & {
  type: DIALOG_TYPE.TIMETABLE_EVENT;
  slot: TimetableSlot;
};

export type NotificationsDialogParams = DialogParamsBase & {
  type: DIALOG_TYPE.NOTIFICATIONS;
};

export type DialogParams =
  | ListSelectorDialogParams
  | TimetableOptionsDialogParams
  | TimetableEventDialogParams
  | NotificationsDialogParams;

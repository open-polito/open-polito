export type DropdownItem = {
  label: string;
  value: string;
};

export enum DIALOG_TYPE {
  LIST_SELECTOR = 'LIST_SELECTOR',
  TIMETABLE_OPTIONS = 'TIMETABLE_OPTIONS',
  NOTIFICATIONS = 'NOTIFICATIONS',
}

export type DialogParams = {
  title?: string;
  type: DIALOG_TYPE;
};

export type ListSelectorDialogParams = DialogParams & {
  type: DIALOG_TYPE.LIST_SELECTOR;
  items: [];
};

export type TimetableOptionsDialogParams = DialogParams & {
  type: DIALOG_TYPE.TIMETABLE_OPTIONS;
};

export type NotificationsDialogParams = DialogParams & {
  type: DIALOG_TYPE.NOTIFICATIONS;
};

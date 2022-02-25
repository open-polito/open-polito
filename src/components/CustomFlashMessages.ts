import {TFunction} from 'react-i18next';
import {StatusBar} from 'react-native';
import {MessageOptions, MessageType} from 'react-native-flash-message';
import colors, {Color} from '../colors';
import styles from '../styles';

const getPaddingTop = () => {
  return StatusBar.currentHeight;
};

/**
 * Base object used by all custom flash messages.
 *
 * Objects are to be passed to showMessage() (from react-native-flash-message)
 */
const flashMessageBase = (
  t: TFunction,
  message: string,
  description: string = '',
  type: MessageType,
  backgroundColor: Color,
  color: Color,
  duration: number,
): MessageOptions => {
  StatusBar.setBarStyle('light-content');
  return {
    message: t(message),
    description: t(description),
    type,
    backgroundColor,
    color,
    duration,
    statusBarHeight: getPaddingTop(),
    icon: 'auto',
    titleStyle: styles.textRegular,
    textStyle: styles.textRegular,
  };
};

/**
 * Custom components by type:
 * - info
 * - warn
 * - error
 * - success
 */

export const infoFlashMessage = (
  t: TFunction,
  message: string,
  description: string = '',
) => {
  return flashMessageBase(
    t,
    message,
    description,
    'info',
    colors.gradient1,
    colors.white,
    3000,
  );
};

export const warnFlashMessage = (
  t: TFunction,
  message: string,
  description: string = '',
) => {
  return flashMessageBase(
    t,
    message,
    description,
    'warning',
    colors.orange,
    colors.white,
    3000,
  );
};

export const errorFlashMessage = (
  t: TFunction,
  message: string,
  description: string = '',
) => {
  return flashMessageBase(
    t,
    message,
    description,
    'danger',
    colors.red,
    colors.white,
    3000,
  );
};

export const successFlashMessage = (
  t: TFunction,
  message: string,
  description: string = '',
) => {
  return flashMessageBase(
    t,
    message,
    description,
    'success',
    colors.green,
    colors.white,
    3000,
  );
};

/**
 * Custom flash messages
 */

export const logoutFlashMessage = (t: TFunction) => {
  return infoFlashMessage(t, 'logoutFlashMessage');
};

export const loginPendingFlashMessage = (t: TFunction) => {
  return infoFlashMessage(t, 'loginPendingFlashMessage');
};

export const loginErrorFlashMessage = (t: TFunction) => {
  return errorFlashMessage(t, 'loginErrorFlashMessage', 'loginErrorFlashDesc');
};

export const loginSuccessFlashMessage = (t: TFunction) => {
  return successFlashMessage(t, 'loginSuccessFlashMessage');
};

export const notImplementedFlashMessage = (t: TFunction) => {
  return warnFlashMessage(
    t,
    'notImplementedFlashMessage',
    'notImplementedFlashMessageDesc',
  );
};

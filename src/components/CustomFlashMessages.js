import {StatusBar} from 'react-native';
import colors from '../colors';
import styles from '../styles';

function getPaddingTop() {
  return StatusBar.currentHeight;
}

/**
 * Base object used by all custom flash messages.
 *
 * Objects are to be passed to showMessage() (from react-native-flash-message)
 */

function flashMessageBase(
  t,
  message,
  description = '',
  type,
  backgroundColor,
  color,
  duration,
) {
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
}

/**
 * Custom components by type:
 * - info
 * - warn
 * - error
 * - success
 */

export function infoFlashMessage(t, message, description = '') {
  return flashMessageBase(
    t,
    message,
    description,
    'info',
    colors.gradient1,
    colors.white,
    3000,
  );
}

export function warnFlashMessage(t, message, description = '') {
  return flashMessageBase(
    t,
    message,
    description,
    'warning',
    colors.orange,
    colors.white,
    3000,
  );
}

export function errorFlashMessage(t, message, description = '') {
  return flashMessageBase(
    t,
    message,
    description,
    'danger',
    colors.red,
    colors.white,
    3000,
  );
}

export function successFlashMessage(t, message, description = '') {
  return flashMessageBase(
    t,
    message,
    description,
    'success',
    colors.green,
    colors.white,
    3000,
  );
}

/**
 * Custom flash messages
 */

export function logoutFlashMessage(t) {
  return infoFlashMessage(t, 'logoutFlashMessage');
}

export function loginPendingFlashMessage(t) {
  return infoFlashMessage(t, 'loginPendingFlashMessage');
}

export function loginErrorFlashMessage(t) {
  return errorFlashMessage(t, 'loginErrorFlashMessage', 'loginErrorFlashDesc');
}

export function loginSuccessFlashMessage(t) {
  return successFlashMessage(t, 'loginSuccessFlashMessage');
}

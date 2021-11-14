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
  message,
  description,
  type,
  backgroundColor,
  color,
  duration,
) {
  return {
    message,
    description,
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

export function infoFlashMessage(message, description) {
  return flashMessageBase(
    message,
    description,
    'info',
    colors.gradient1,
    colors.white,
    3000,
  );
}

export function warnFlashMessage(message, description) {
  return flashMessageBase(
    message,
    description,
    'warning',
    colors.orange,
    colors.white,
    3000,
  );
}

export function errorFlashMessage(message, description) {
  return flashMessageBase(
    message,
    description,
    'danger',
    colors.red,
    colors.white,
    3000,
  );
}

export function successFlashMessage(message, description) {
  return flashMessageBase(
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

export function logoutFlashMessage() {
  return infoFlashMessage('Logging out...', 'You are being logged out');
}

export function loginErrorFlashMessage() {
  return errorFlashMessage(
    'Authentication error',
    'Invalid credentials or Internet connection not available',
  );
}

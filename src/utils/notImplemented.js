import {showMessage} from 'react-native-flash-message';
import {notImplementedFlashMessage} from '../components/CustomFlashMessages';

// Use this function for components that are not fully implemented yet.
export default function notImplemented(t) {
  showMessage(notImplementedFlashMessage(t));
}

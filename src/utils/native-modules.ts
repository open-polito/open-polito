import {NativeModules} from 'react-native';
const {UpdaterModule} = NativeModules;

export const installUpdate = () => {
  UpdaterModule.installUpdate();
};

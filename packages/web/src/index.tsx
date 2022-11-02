import 'react-native-gesture-handler';
import {enableExperimentalWebImplementation} from 'react-native-gesture-handler';
enableExperimentalWebImplementation(true);

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from '@open-polito/common/src/App';
import {View} from 'react-native';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <View style={{height: '100vh'}}>
      <App />
    </View>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

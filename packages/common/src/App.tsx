// import React, {Suspense, useEffect} from 'react';
// import {Provider} from 'react-redux';
// import Router from './routes/Router';

// import i18n from 'i18next';
// import {initReactI18next} from 'react-i18next';
// import EN from './locales/en';
// import IT from './locales/it';
// import * as RNLocalize from 'react-native-localize';

// import 'moment/locale/it';

// import store from './store/store';
// import moment from 'moment';
// import {Device} from 'open-polito-api/lib/device';
// import DeviceProvider from './context/Device';
// import {
//   RenderHTMLConfigProvider,
//   TRenderEngineProvider,
// } from 'react-native-render-html';
// import Toast from './ui/Toast';
// import {ModalProvivder} from './context/ModalProvider';
// import ModalComponent from './components/modals/ModalComponent';

// let lng = '';
// if (RNLocalize.getLocales()[0].languageCode === 'it') {
//   lng = 'it';
// } else {
//   lng = 'en';
// }

// i18n.use(initReactI18next).init({
//   resources: {
//     en: {translation: EN},
//     it: {translation: IT},
//   },
//   lng: lng,
//   fallbackLng: 'en',
//   interpolation: {escapeValue: false},
//   debug: false,
// });

// moment.locale(lng);

// // Device instance to pass to Context API for global use
// const defaultDevice = new Device('', 10000, () => {});

// export default function App() {
//   useEffect(() => {
//     RNLocalize.addEventListener('change', setNewLocale);
//     return () => {
//       RNLocalize.removeEventListener('change', setNewLocale);
//     };
//   }, []);

//   const setNewLocale = () => {
//     if (RNLocalize.getLocales()[0].languageCode === 'it') {
//       i18n.changeLanguage('it');
//       moment.locale('it');
//     } else {
//       i18n.changeLanguage('en');
//       moment.locale('en');
//     }
//   };

//   return (
//     <Suspense fallback="Loading...">
//       <Provider store={store}>
//         <DeviceProvider device={defaultDevice}>
//           <ModalProvivder>
//             <TRenderEngineProvider
//               tagsStyles={{
//                 p: {
//                   marginTop: 0,
//                 },
//               }}>
//               <RenderHTMLConfigProvider>
//                 <Router />
//                 <Toast />
//                 <ModalComponent />
//               </RenderHTMLConfigProvider>
//             </TRenderEngineProvider>
//           </ModalProvivder>
//         </DeviceProvider>
//       </Provider>
//     </Suspense>
//   );
// }

import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import {View, Button} from 'react-native';
import React from 'react';

export default function AnimatedStyleUpdateExample() {
  const randomWidth = useSharedValue(10);

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(randomWidth.value, config),
    };
  });

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
      }}>
      <Animated.View
        style={[
          {width: 100, height: 80, backgroundColor: 'black', margin: 30},
          style,
        ]}
      />
      <Button
        title="toggle"
        onPress={() => {
          randomWidth.value = Math.random() * 350;
        }}
      />
    </View>
  );
}

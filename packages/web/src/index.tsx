// import 'react-native-reanimated';
// import 'react-native-gesture-handler';
// import {enableExperimentalWebImplementation} from 'react-native-gesture-handler';
// enableExperimentalWebImplementation(true);

// import React from 'react';
import ReactDOM from 'react-dom/client';

// import App from '@open-polito/common/src/App';
// import {View} from 'react-native';

// // Generate required css
// import iconFont from '@open-polito/common/assets/fonts/tabler-icons.ttf';
// import regularFont from '@open-polito/common/assets/fonts/Inter-Regular.ttf';
// import mediumFont from '@open-polito/common/assets/fonts/Inter-Medium.ttf';
// import boldFont from '@open-polito/common/assets/fonts/Inter-Bold.ttf';

// console.log('ICON FONT', iconFont);

// const iconFontStyles = `@font-face {
//   src: url(${iconFont});
//   font-family: tabler-icons;
// }

// @font-face {
//   src: url(${regularFont});
//   font-family: Inter-Regular;
// }

// @font-face {
//   src: url(${mediumFont});
//   font-family: Inter-Medium;
// }

// @font-face {
//   src: url(${boldFont});
//   font-family: Inter-Bold;
// }`;

// // Create stylesheet
// const style = document.createElement('style');
// if (style.style) {
//   style.textContent = iconFontStyles;
// } else {
//   style.appendChild(document.createTextNode(iconFontStyles));
// }

// // Inject stylesheet
// document.head.appendChild(style);

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement,
// );

// root.render(
//   <React.StrictMode>
//     <View style={{height: '100vh'}}>
//       <App />
//     </View>
//   </React.StrictMode>,
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import {View, Button} from 'react-native';
import React from 'react';

export default function App() {
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

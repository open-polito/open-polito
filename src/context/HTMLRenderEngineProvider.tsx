import React, {ReactNode, useContext, useMemo} from 'react';
import {
  RenderHTMLConfigProvider,
  TRenderEngineProvider,
} from 'react-native-render-html';
import colors, {Color} from '../colors';
import {p} from '../scaling';
import {DeviceContext} from './Device';

const HTMLRenderEngineProvider = ({children}: {children: ReactNode}) => {
  const {dark} = useContext(DeviceContext);

  const color = useMemo<Color | undefined>(
    () => (dark ? colors.gray200 : undefined),
    [dark],
  );

  return (
    <TRenderEngineProvider
      tagsStyles={{
        p: {
          marginVertical: 4 * p,
          color,
        },
      }}>
      <RenderHTMLConfigProvider>{children}</RenderHTMLConfigProvider>
    </TRenderEngineProvider>
  );
};

export default HTMLRenderEngineProvider;

import React, {ReactNode, useContext, useMemo} from 'react';
import {
  MixedStyleDeclaration,
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

  const tagsStyles = useMemo<Readonly<Record<string, MixedStyleDeclaration>>>(
    () => ({
      p: {
        marginVertical: 4 * p,
        color,
      },
    }),
    [color],
  );

  return (
    <TRenderEngineProvider tagsStyles={tagsStyles}>
      <RenderHTMLConfigProvider>{children}</RenderHTMLConfigProvider>
    </TRenderEngineProvider>
  );
};

export default HTMLRenderEngineProvider;

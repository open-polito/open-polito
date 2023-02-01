import {genericPlatform} from './platform';

// Edit global Window interface to add __TAURI__ property
declare global {
  interface Window {
    __TAURI__: any;
  }
}

/**
 * Temporary fix to Webpack not being able to process the `@tauri-apps/api` module.
 *
 * TODO fix this when someone knows how. When fixed, also remove `withGlobalTauri` from manifest.
 *
 * Note: doesn't have typings.
 */
export const _globalTauri =
  genericPlatform === 'desktop' ? window.__TAURI__ : undefined;

import glyphMap from '../../assets/fonts/selection-final.json';
export {glyphMap};

// Extract icon names from JSON object, so we get type checking on valid icon names
export type GlyphName = keyof typeof glyphMap;

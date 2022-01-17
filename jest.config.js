/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

const {defaults: tsjPreset} = require('ts-jest/presets');

module.exports = {
  ...tsjPreset,
  preset: 'react-native',
  testEnvironment: 'node',
  transform: {
    ...tsjPreset.transform,
  },
};

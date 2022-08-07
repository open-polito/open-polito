export const CONFIG_SCHEMA_VERSION = 3;

export type Configuration = {
  schemaVersion: number;

  login: boolean; // Whether user is logged in to the app

  beta: boolean;

  logging: boolean;

  theme: 'dark' | 'light' | 'system';

  timetableOverlap: 'split' | 'priority';
  timetablePriority: string[];
};

const defaultConfig: Configuration = {
  schemaVersion: CONFIG_SCHEMA_VERSION,

  login: false,

  beta: false,

  logging: false,

  theme: 'system',

  timetableOverlap: 'split',
  timetablePriority: [],
};

export default defaultConfig;

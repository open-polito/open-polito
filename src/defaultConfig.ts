export const CONFIG_SCHEMA_VERSION = 2;

export type Configuration = {
  schemaVersion: number;

  login: boolean; // Whether user is logged in to the app

  beta: boolean;

  logging: boolean;

  theme: 'dark' | 'light' | 'system';

  timetable: {
    overlap: 'split' | 'priority';
    priority: string[];
  };
};

const defaultConfig: Configuration = {
  schemaVersion: CONFIG_SCHEMA_VERSION,

  login: false,

  beta: false,

  logging: false,

  theme: 'system',

  timetable: {
    overlap: 'split',
    priority: [],
  },
};

export default defaultConfig;

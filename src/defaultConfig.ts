export const CONFIG_SCHEMA_VERSION = 1;

export type Configuration = {
  schemaVersion: number;

  beta: boolean;

  logging: boolean;
  emailWebView: boolean;

  timetable: {
    overlap: 'split' | 'priority';
    priority: string[];
  };
};

const defaultConfig: Configuration = {
  schemaVersion: CONFIG_SCHEMA_VERSION,

  beta: false,

  logging: false,
  emailWebView: false,

  timetable: {
    overlap: 'split',
    priority: [],
  },
};

export default defaultConfig;

export type Configuration = {
  beta: boolean;

  logging: boolean;
  emailWebView: boolean;

  timetable: {
    overlap: 'split' | 'priority';
  };
};

const defaultConfig: Configuration = {
  beta: false,

  logging: false,
  emailWebView: false,

  timetable: {
    overlap: 'split',
  },
};

export default defaultConfig;

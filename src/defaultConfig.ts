export type Configuration = {
  logging: boolean;
  emailWebView: boolean;

  timetable: {
    overlap: 'split' | 'priority';
  };
};

const defaultConfig: Configuration = {
  logging: false,
  emailWebView: false,

  timetable: {
    overlap: 'split',
  },
};

export default defaultConfig;

export type Configuration = {
  logging: boolean;
  emailWebView: boolean;
};

const defaultConfig: Configuration = {
  logging: false,
  emailWebView: false,
};

export default defaultConfig;

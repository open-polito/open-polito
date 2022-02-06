export type Config = {
  logging: boolean,
  emailWebView: boolean,
}

const defaultConfig: Config = {
  logging: false,
  emailWebView: false,
};

export default defaultConfig;

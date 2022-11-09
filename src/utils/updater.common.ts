import {Platform} from 'react-native';
import Config from 'react-native-config';
import version from '../../version.json';

/**
 * Structure of one array item found in "release.json",
 * found in the root directory of the repo.
 */
export type ReleaseJsonEntry = {
  type: 'release' | 'beta' | 'dev';
  tag: string;
  versionCode: number;
  format: 'text' | 'html';
  notes: {
    language: 'it' | 'en';
    content: string[];
  }[];
};

/**
 * Structure of one array item found in "assets.json",
 * found for each GitHub release.
 */
export type AssetsJsonEntry = {
  os: string;
  arch: string;
  name: string;
  sha256: string;
};

/**
 * Structure of the portion we need from GitHub's response json
 * when fetching release data.
 */
export type PartialGitHubReleaseResponse = {
  assets: {
    name: string;
    browser_download_url: string;
    size: number; // in bytes
  }[];
};

export const isGitHubOnline = async (): Promise<boolean> => {
  const statusCode = (await fetch('https://api.github.com')).status;
  return statusCode === 200;
};

/**
 * Returns the release.json contents
 * @returns
 */
export const fetchReleaseJson = async (): Promise<ReleaseJsonEntry[]> => {
  return (await (
    await fetch(
      'https://raw.githubusercontent.com/open-polito/open-polito/master/release.json',
    )
  ).json()) as ReleaseJsonEntry[];
};

/**
 * Return release data by tag
 * @param tag The release tag
 */
export const fetchReleaseByTag = async (
  tag: string,
): Promise<PartialGitHubReleaseResponse> => {
  return (await (
    await fetch(
      `https://api.github.com/repos/open-polito/open-polito/releases/tags/${tag}`,
      {
        headers: {Accept: 'application/vnd.github+json'},
      },
    )
  ).json()) as PartialGitHubReleaseResponse;
};

/**
 * Check for updates, if and only if the following are all true:
 * - The OS is Android
 * - The app was not installed from PLAY_STORE (see {@link version})
 * - The device is online (can reach GitHub API)
 */
export const checkForUpdates = async (): Promise<
  ReleaseJsonEntry | undefined
> => {
  if (Platform.OS === 'android' && !['PLAY_STORE'].includes(version.from)) {
    (async () => {
      const reachable = await isGitHubOnline();
      if (!reachable) {
        return undefined;
      }
      try {
        const releaseData = (await fetchReleaseJson()).find(
          r => r.type === Config.VARIANT && r.versionCode > version.versionCode,
        );
        return releaseData;
      } catch (e) {}
    })();
  }
  return undefined;
};

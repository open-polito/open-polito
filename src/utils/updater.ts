import {ExternalDirectoryPath, hash} from 'react-native-fs';

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
export const fetchReleaseJson = async (): Promise<ReleaseJsonEntry[]> =>
  (await (
    await fetch(
      'https://raw.githubusercontent.com/open-polito/open-polito/master/release.json',
    )
  ).json()) as ReleaseJsonEntry[];

/**
 * Return release data by tag
 * @param tag The release tag
 */
export const fetchReleaseByTag = async (
  tag: string,
): Promise<PartialGitHubReleaseResponse> =>
  (await (
    await fetch(
      `https://api.github.com/repos/robertolaru/testrepo/releases/tags/${tag}`,
      {
        headers: {Accept: 'application/vnd.github+json'},
      },
    )
  ).json()) as PartialGitHubReleaseResponse;

/**
 * Checks file integrity with SHA256
 * @param filePath
 * @param sha256
 * @returns
 */
export const checkFileMatchesSHA256 = async (
  filePath: string,
  sha256: string,
): Promise<boolean> => {
  const computedSHA256 = await hash(filePath, 'sha256');
  return sha256.toLowerCase() === computedSHA256.toLowerCase();
};

export const getUpdateDestinationFilePath = () => {
  return ExternalDirectoryPath + '/update.apk';
};

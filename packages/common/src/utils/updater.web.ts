import {
  isGitHubOnline,
  fetchReleaseByTag,
  fetchReleaseJson,
} from './updater.common';

const updateCleanup = async () => {};
const getUpdateDestinationFilePath = async () => {};
const checkFileMatchesSHA256 = async () => {};

export {
  isGitHubOnline,
  fetchReleaseByTag,
  fetchReleaseJson,
  updateCleanup,
  getUpdateDestinationFilePath,
  checkFileMatchesSHA256,
};

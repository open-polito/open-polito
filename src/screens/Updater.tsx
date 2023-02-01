import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {ActivityIndicator, Platform, StyleSheet, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
  downloadFile,
  exists,
  getFSInfo,
  stopDownload,
  unlink,
} from 'react-native-fs';
import colors from '../colors';
import {DeviceContext} from '../context/Device';
import {p} from '../scaling';
import Button from '../ui/core/Button';
import Text from '../ui/core/Text';
import {computeSizeLabel} from '../ui/DirectoryItem';
import ProgressCircle from '../ui/ProgressCircle';
import Screen from '../ui/Screen';
import {UpdaterModule} from '../utils/native-modules';
import {
  AssetsJsonEntry,
  checkFileMatchesSHA256,
  fetchReleaseByTag,
  getUpdateDestinationFilePath,
  isGitHubOnline,
  PartialGitHubReleaseResponse,
  ReleaseJsonEntry,
} from '../utils/updater';
import Analytics from 'appcenter-analytics';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UpdaterScreenProps {
  releaseData: ReleaseJsonEntry;
}

type UpdateStatus =
  | 'IDLE'
  | 'GET_DATA'
  | 'DOWNLOAD'
  | 'CHECK_INTEGRITY'
  | 'DONE'
  | 'ERROR';

type ErrorStatus =
  | 'NO_ASSETS_JSON'
  | 'NO_COMPATIBLE_BINARY'
  | 'INSUFFICIENT_SPACE'
  | 'CANT_CONNECT'
  | 'NO_MATCH_CHECKSUMS'
  | 'ERROR';

interface UpdaterState {
  progress: number; // Progress from 0 to 100
  bytesWritten: number;
  bytesTotal: number;
  githubReleaseData?: PartialGitHubReleaseResponse;
  assetData?: AssetsJsonEntry;
}

const getInitialState = (): UpdaterState => {
  return {
    progress: 0,
    bytesWritten: 0,
    bytesTotal: 1,
  };
};

const useUpdateProcess = (releaseData: ReleaseJsonEntry) => {
  const [state, setState] = useState<UpdateStatus>('IDLE');
  const [internalState, setInternalState] = useState<UpdaterState>(
    getInitialState(),
  );
  const [error, setError] = useState<ErrorStatus | undefined>();
  const [errMsg, setErrMsg] = useState<string>('');

  const trackInstallReached = useCallback(async () => {
    await Analytics.trackEvent('UPDATE_INSTALL_PROMPT_REACHED');
  }, []);

  const trackError = useCallback(() => {
    if (error) {
      Analytics.trackEvent('UPDATE_ERROR', {
        status: error,
        msg: errMsg,
      });
    }
  }, [error, errMsg]);

  // Handle errors
  useEffect(() => {
    error && trackError();
    setError(undefined); // Reset error state to avoid re-calling effect
  }, [error, trackError]);

  const startUpdateProcess = useCallback(async () => {
    setInternalState(getInitialState());
    setState('IDLE');
    setError(undefined);
    setErrMsg('');
    try {
      if (!releaseData) {
        return;
      }

      // Save versionCode to AsyncStorage
      await AsyncStorage.setItem(
        '@versionCode',
        releaseData.versionCode.toString(),
      );

      /**
       * Fetch release data from GitHub
       */

      setState('GET_DATA');
      const reachable = await isGitHubOnline();
      if (!reachable) {
        setError('CANT_CONNECT');
        throw new Error("Can't connect!");
      }
      const githubReleaseData = await fetchReleaseByTag(releaseData.tag);
      setInternalState(prev => ({...prev, githubReleaseData}));
      const assetsUrl = githubReleaseData.assets.find(
        a => a.name === 'assets.json',
      )?.browser_download_url;
      if (!assetsUrl) {
        setError('NO_ASSETS_JSON');
        throw new Error("Can't find assets.json!");
      }
      const assetsJson = JSON.parse(
        await (await fetch(assetsUrl)).text(),
      ) as AssetsJsonEntry[];

      // I think this uses Android's Build.SUPPORTED_ABIS
      // From Android docs: "The most preferred ABI is the first element in the list".
      const deviceAbis = DeviceInfo.supportedAbisSync();

      // Find proper asset for binary download,
      // prioritizing by the device ABI array order.
      let chosenAsset: AssetsJsonEntry | undefined;
      for (let i = 0; i < deviceAbis.length && chosenAsset === undefined; i++) {
        chosenAsset = assetsJson.find(
          asset => asset.os === Platform.OS && asset.arch === deviceAbis[i],
        );
      }

      // If still no compatible architecture found, choose the universal one,
      // a.k.a the one with an empty arch string
      if (!chosenAsset) {
        chosenAsset = assetsJson.find(
          asset => asset.os === Platform.OS && asset.arch === '',
        );
      }

      // If for some weird reason no asset is found yet, it means there's an error
      // from the assets.json file
      if (!chosenAsset) {
        setError('NO_COMPATIBLE_BINARY');
        throw new Error('No compatible update found!');
      }

      // Final binary url
      const assetUrl = githubReleaseData.assets.find(
        a => a.name === chosenAsset?.name,
      )?.browser_download_url;

      setInternalState(prev => ({
        ...prev,
        assetData: chosenAsset,
      }));

      const updateDestinationFilePath = getUpdateDestinationFilePath();

      /**
       * If downloaded apk is found AND checksums match,
       * install without re-downloading
       */
      const binaryExists = await exists(updateDestinationFilePath);
      if (binaryExists) {
        setState('CHECK_INTEGRITY');
        const matches = await checkFileMatchesSHA256(
          updateDestinationFilePath,
          chosenAsset.sha256,
        );
        if (matches) {
          setState('DONE');
          setInternalState(prev => ({
            ...prev,
            progress: 100,
          }));
          UpdaterModule.installUpdate();
          await trackInstallReached();
          return; // Finish here
        }
      }

      /**
       * Now download the new binary file
       */

      setState('DOWNLOAD');
      const {freeSpace} = await getFSInfo();

      // Wait for file download
      const {jobId, promise} = downloadFile({
        fromUrl: assetUrl!,
        toFile: updateDestinationFilePath,
        begin: res => {
          if (res.contentLength > freeSpace) {
            stopDownload(jobId);
            unlink(updateDestinationFilePath)
              .catch()
              .finally(() => {
                setError('INSUFFICIENT_SPACE');
                throw new Error('Insufficient space!');
              });
          }
        },
        progressInterval: 100,
        progress: res => {
          setInternalState(prev => ({
            ...prev,
            bytesWritten: res.bytesWritten,
            bytesTotal: res.contentLength,
            progress: Math.ceil(
              (100 * res.bytesWritten) /
                (res.contentLength !== 0 ? res.contentLength : 1),
            ),
          }));
        },
        connectionTimeout: 10000,
      });

      await promise;

      // Compare checksums
      setState('CHECK_INTEGRITY');
      const matches = await checkFileMatchesSHA256(
        updateDestinationFilePath,
        chosenAsset.sha256,
      );
      if (matches) {
        UpdaterModule.installUpdate();
        await trackInstallReached();
      } else {
        setError('NO_MATCH_CHECKSUMS');
        throw new Error("Checksums don't match!");
      }

      setState('DONE');
      setInternalState(prev => ({
        ...prev,
        progress: 100,
      }));
    } catch (e) {
      setState('ERROR');
      setErrMsg((e as Error).message);
    }
  }, [releaseData, setState, trackInstallReached]);

  return {state, internalState, errMsg, startUpdateProcess};
};

const Updater: FC<UpdaterScreenProps> = ({releaseData}) => {
  const {dark} = useContext(DeviceContext);
  const {t} = useTranslation();

  const startedUpdate = useRef(false);

  const {state, internalState, errMsg, startUpdateProcess} =
    useUpdateProcess(releaseData);

  useEffect(() => {
    !startedUpdate.current && startUpdateProcess();
    startedUpdate.current = true;
  }, [startUpdateProcess]);

  const stateLabel = useMemo(() => {
    switch (state) {
      case 'IDLE':
        return t('updaterStateIdle');
      case 'GET_DATA':
        return t('updaterStateGetData');
      case 'DOWNLOAD':
        return t('updaterStateDownload');
      case 'DONE':
        return t('updaterStateDone');
      case 'CHECK_INTEGRITY':
        return t('updaterStateCheckIntegrity');
      case 'ERROR':
        return `${t('updaterStateError')}\n${errMsg}`;
    }
  }, [state, t, errMsg]);

  const _styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        paddingHorizontal: 16 * p,
        paddingBottom: 16 * p,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
      },
      section: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
    });
  }, []);

  return (
    <Screen>
      <View style={[_styles.container]}>
        <View style={_styles.section}>
          <Text s={20 * p} w="r" c={dark ? colors.gray100 : colors.gray800}>
            {t('updaterScreenHeading')}
          </Text>
        </View>
        <View style={_styles.section}>
          <ProgressCircle
            value={internalState.progress}
            max={100}
            radius={64 * p}
            fontSize={24 * p}
            strokeWidth={16 * p}
            label={`${internalState.progress}%`}
            backgroundColor={dark ? colors.gray800 : colors.gray100}
            dark={dark}>
            {internalState.progress !== 0 && internalState.progress !== 100 && (
              <Text s={10 * p} w="r" c={dark ? colors.gray200 : colors.gray700}>
                {`${computeSizeLabel(
                  internalState.bytesWritten,
                )} / ${computeSizeLabel(internalState.bytesTotal)}`}
              </Text>
            )}
          </ProgressCircle>
          <View style={{height: 32 * p}} />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {state !== 'ERROR' && state !== 'DONE' && (
              <>
                <ActivityIndicator color={colors.accent300} />
                <View style={{width: 8 * p}} />
              </>
            )}
            <Text
              s={12 * p}
              w="r"
              c={
                state === 'ERROR'
                  ? colors.red
                  : dark
                  ? colors.gray200
                  : colors.gray700
              }>
              {stateLabel}
            </Text>
          </View>
        </View>

        <View style={_styles.section}>
          {state === 'DONE' && (
            <View style={{marginTop: 32 * p}}>
              <Text s={12 * p} w="r" c={dark ? colors.gray200 : colors.gray700}>
                {t('didYouMissTheInstallMenu')}
              </Text>
            </View>
          )}
          {(state === 'ERROR' || state === 'DONE') && (
            <View style={{flexDirection: 'row', marginTop: 16 * p}}>
              <View style={{flex: 1}}>
                <Button
                  text={t(state === 'ERROR' ? 'tryAgain' : 'reopenInstallMenu')}
                  color={state === 'ERROR' ? colors.red : colors.accent300}
                  onPress={
                    state === 'ERROR'
                      ? startUpdateProcess
                      : UpdaterModule.installUpdate
                  }
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </Screen>
  );
};

export default Updater;

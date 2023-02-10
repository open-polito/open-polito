import {Platform} from 'react-native';
import {Device} from 'open-polito-api/lib/device';
import {getDownloadURL} from 'open-polito-api/lib/material';
import {
  documentDirectory,
  makeDirectoryAsync,
  StorageAccessFramework,
} from 'expo-file-system';

interface LocalFile {
  name: string;
  /**
   * Unix epoch
   */
  creationDate: number;
}

type FileCode = string;

enum QueueEvent {
  Add = 'add',
  Remove = 'remove',
  State = 'state',
}

enum QueueState {
  Idle = 'idle',
  Downloading = 'downloading',
}

interface QueueConfig {
  maxParallelDownloads: number;
}

interface DownloadManager {
  device?: Device;
  queue: FileCode[];
  downloading: FileCode[];
  state: QueueState;
  config: QueueConfig;
}

export namespace Downloader {
  /**
   * Manager object
   */
  export const manager: DownloadManager = {
    device: undefined,
    queue: [],
    downloading: [],
    state: QueueState.Idle,
    config: {
      maxParallelDownloads: 4,
    },
  };

  const recompute = () => {
    if (manager.downloading.length < manager.config.maxParallelDownloads) {
      const code = manager.queue.shift();
      if (code) {
        manager.downloading.push(code);
        if (manager.state === QueueState.Downloading) {
          download(code);
        }
      }
    }
  };

  export const enqueue = (code: FileCode) => {
    manager.queue.push(code);
    recompute();
  };

  export const dequeue = (code: FileCode) => {
    manager.queue = manager.queue.filter(c => c !== code);
    recompute();
  };

  export const start = () => {
    manager.state = QueueState.Downloading;
    recompute();
  };

  export const stop = () => {
    manager.state = QueueState.Idle;
    recompute();
  };

  export const setDevice = (device: Device) => {
    manager.device = device;
  };

  /**
   * Ensure permissions are granted, etc...
   */
  export const init = async () => {
    // Get permissions
    if (Platform.OS === 'android') {
      await makeDirectoryAsync(documentDirectory + 'open-polito-downloads', {
        intermediates: false,
      });
    }
  };

  const download = async (code: FileCode) => {
    if (!manager.device) {
      console.error('No device set');
      return;
    }

    const url = await getDownloadURL(manager.device, parseInt(code, 10));

    try {
      // TODO download

      dequeue(code);
    } catch (e) {}
  };
}

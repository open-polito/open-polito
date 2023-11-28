import 'package:open_polito/logic/downloader/download_utils.dart';

class DownloadQueue {
  final List<DownloadQueueItem> _queue = const [];

  void add(DownloadQueueItem item) {
    _queue.add(item);
  }

  DownloadQueueItem next() {
    return _queue.removeAt(0);
  }

  void remove() {}
}

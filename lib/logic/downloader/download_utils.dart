const downloadsDirectoryBaseName = "open_polito";
const videosDirectoryBaseName = "__videos";

/// Download chunk size
const chunkSize = 1024 * 1024 * 8;

/// All possible types of items handled by [DownloadService].
enum DownloadItemType {
  /// File from the course material
  file,

  /// Recorded class from a course
  video,
}

class DownloadQueueItem {
  final DownloadItemType type;

  /// Full relative path where file will be stored
  final String path;
  final String filename;

  /// Download url
  final String url;

  const DownloadQueueItem({
    required this.type,
    required this.path,
    required this.filename,
    required this.url,
  });
}

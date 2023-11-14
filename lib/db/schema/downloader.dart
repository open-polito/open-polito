import 'package:drift/drift.dart';

enum DbDownloadStatus {
  /// This item has not been downloaded. It's idle.
  newItem,

  /// Added to queue. Download not started yet.
  enqueued,

  /// Downloading. The file download is partial, or otherwise not complete.
  downloading,

  /// File successfully downloaded.
  downloaded,
}

enum DbDownloadItemType {
  /// File from course material
  file,

  /// Video recording
  video,
}

class DbDownloadItems extends Table {
  @override
  String? get tableName => "download_items";

  IntColumn get id => integer().autoIncrement()();

  TextColumn get status => textEnum<DbDownloadStatus>()();
  TextColumn get type => textEnum<DbDownloadItemType>()();

  Int64Column get totalSize => int64().nullable()();
  Int64Column get totalDowloaded => int64().nullable()();
  TextColumn get downloadUrl => text().nullable()();
  TextColumn get fileName => text().nullable()();

  // Metadata from API to display item
  TextColumn get originalName => text().nullable()();

  // TODO: finish
}

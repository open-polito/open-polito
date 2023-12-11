import 'package:drift/drift.dart';

enum DbDownloadStatus {
  /// Added to queue. Download not started yet.
  enqueued,

  /// Downloading. The file download is partial, or otherwise not complete.
  downloading,
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

  /// Unique item id from API
  TextColumn get itemId => text()();

  TextColumn get status => textEnum<DbDownloadStatus>()();
  TextColumn get type => textEnum<DbDownloadItemType>()();

  IntColumn get totalSize => integer().nullable()();
  IntColumn get totalDowloaded => integer().nullable()();
  TextColumn get url => text()();

  /// Relative path to file, from base directory
  TextColumn get path => text()();

  /// Name displayed in the UI. Not guaranteed to be the filename
  TextColumn get displayName => text()();
  TextColumn get mimeType => text().nullable()();

  TextColumn get courseName => text()();

  /// Original file creation datetime
  DateTimeColumn get createdAt => dateTime()();

  /// Temporary directory where partial item is stored
  TextColumn get tempPath => text().nullable()();
}

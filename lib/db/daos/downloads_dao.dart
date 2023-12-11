import 'package:drift/drift.dart';
import 'package:open_polito/db/database.dart';
import 'package:open_polito/db/schema/schema.dart';

part 'downloads_dao.g.dart';

@DriftAccessor(tables: [DbDownloadItem])
class DownloadsDao extends DatabaseAccessor<AppDatabase>
    with _$DownloadsDaoMixin {
  DownloadsDao(super.db);

  /// Add item to queue
  Future<void> addToQueue({
    required String itemId,
    required DbDownloadItemType type,
    required String url,

    /// Relative path from downloads base directory
    required String path,
    required String displayName,
    required String courseName,
    required DateTime createdAt,
  }) async {
    await into(db.dbDownloadItems).insert(DbDownloadItemsCompanion.insert(
      itemId: itemId,
      status: DbDownloadStatus.enqueued,
      type: type,
      path: path,
      url: url,
      displayName: displayName,
      courseName: courseName,
      createdAt: createdAt,
    ));
  }

  /// Get item by [id]
  Future<DbDownloadItem?> getItem(int id) async {
    return await (select(db.dbDownloadItems)
          ..where((tbl) => tbl.id.equals(id))
          ..limit(1))
        .getSingleOrNull();
  }

  /// Update an existing progress/queue item
  Future<void> updateItem({
    required int id,
    required String itemId,
    int? totalSize,
    int? totalDownloaded,
    String? tempPath,
    DbDownloadStatus? status,
  }) async {
    await (update(db.dbDownloadItems)
          ..where((tbl) => tbl.id.equals(id) & tbl.itemId.equals(itemId)))
        .write(DbDownloadItemsCompanion(
      totalSize: Value(totalSize),
      totalDowloaded: Value(totalDownloaded),
      tempPath: Value(tempPath),
      status: Value.ofNullable(status),
    ));
  }

  /// Get all items
  Stream<List<DbDownloadItem>> getAll() {
    final res = (select(db.dbDownloadItems)
          ..orderBy([(tbl) => OrderingTerm.asc(tbl.id)]))
        .watch();
    return res;
  }

  /// Get next item from queue that needs to be downloaded.
  Future<DbDownloadItem?> getNextInQueue() {
    final res = (select(db.dbDownloadItems)
          ..where((tbl) => tbl.status.equalsValue(DbDownloadStatus.enqueued))
          ..orderBy([(tbl) => OrderingTerm.asc(tbl.id)])
          ..limit(1))
        .getSingleOrNull();
    return res;
  }

  /// Get latest item that is "downloading"
  Future<DbDownloadItem?> getLatestDownloading() {
    final res = (select(db.dbDownloadItems)
          ..where((tbl) => tbl.status.equalsValue(DbDownloadStatus.downloading))
          ..orderBy([(tbl) => OrderingTerm.asc(tbl.id)])
          ..limit(1))
        .getSingleOrNull();
    return res;
  }

  /// Clear queue (except downloading items)
  Future<void> clearQueue() {
    return (delete(db.dbDownloadItems)
          ..where((tbl) => tbl.status.equalsValue(DbDownloadStatus.enqueued)))
        .go();
  }

  /// Clear everything (queue and running downloads)
  Future<void> clearAll() {
    return (delete(db.dbDownloadItems)).go();
  }

  /// Remove an item from the queue.
  ///
  /// This deletes the item regardless of its status (enqueued or downloading).
  ///
  /// Use this when an item is removed from the queue
  /// or when a download is completed or canceled.
  Future<void> removeItem(
    int id,
  ) {
    return (delete(db.dbDownloadItems)..where((tbl) => tbl.id.equals(id))).go();
  }
}

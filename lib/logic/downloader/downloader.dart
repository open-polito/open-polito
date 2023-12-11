import 'dart:async';
import 'dart:io';
import 'dart:math';

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:open_polito/db/database.dart';
import 'package:open_polito/db/schema/schema.dart';
import 'package:open_polito/logic/api.dart';
import 'package:open_polito/logic/auth/auth_service.dart';
import 'package:open_polito/logic/downloader/download_utils.dart';
import 'package:open_polito/logic/downloader/filesystem_operations.dart';
import 'package:rxdart/rxdart.dart';

class DownloadService {
  final AppDatabase db;
  final DioWrapper dioW;
  final AuthService authService;

  DownloadService._(this.db, this.dioW, this.authService);

  /// Lock for iteration execution
  bool iterationLocked = false;

  Timer? _checkTimer;

  /// Whether the service is running or paused.
  BehaviorSubject<bool> runningSubject = BehaviorSubject.seeded(true);

  BehaviorSubject<List<DbDownloadItem>> itemsSubject =
      BehaviorSubject.seeded([]);

  static Future<DownloadService> init(
      AppDatabase db, DioWrapper dioW, AuthService authService) async {
    final instance = DownloadService._(db, dioW, authService);

    db.downloadsDao.getAll().listen((event) async {
      instance.itemsSubject.add(event);
    });

    return instance;
  }

  /// Run the service
  void run() async {
    runningSubject.add(true);

    _checkTimer = Timer.periodic(const Duration(seconds: 1), (_) async {
      if (runningSubject.value == true && !iterationLocked) {
        await runIteration();
      }
    });
  }

  /// Pause the service
  Future<void> pause() async {
    runningSubject.add(false);

    _checkTimer?.cancel();
    _checkTimer = null;
  }

  /// Runs one iteration of the download loop
  Future<void> runIteration() async {
    // The lock serves to ensure only one iteration is active at any given time.
    // If the iteration takes longer than the periodic timer, then this
    // guarantees that there won't be more than one running iteration.
    if (iterationLocked) {
      return;
    }

    // Lock
    iterationLocked = true;

    if (kDebugMode) {
      print("Running new downloader iteration step");
    }
    // Check if need to finish some download
    final downloading = await db.downloadsDao.getLatestDownloading();

    if (downloading != null) {
      // Resume/start this download
      await handleDownload();
    } else {
      // Add from queue
      final latest = await db.downloadsDao.getNextInQueue();
      if (latest != null) {
        await initNext();
      }
    }

    // Unlock
    iterationLocked = false;
  }

  /// Add file to download queue
  Future<void> addFileToQueue({
    required String itemId,
    required int courseId,
    required String courseName,
  }) async {
    final item = await db.coursesDao.getFile(itemId);
    if (item == null) {
      return;
    }

    final url =
        "https://app.didattica.polito.it/api/courses/$courseId/files/$itemId";

    await addToQueue(
      itemId: itemId,
      type: DbDownloadItemType.file,
      url: url,
      path: item.path,
      displayName: item.name,
      courseName: courseName,
      createdAt: item.createdAt ?? DateTime.now(),
    );

    if (kDebugMode) {
      print("Added item to queue");
    }
  }

  /// Add item to download queue
  Future<void> addToQueue({
    required String itemId,
    required DbDownloadItemType type,
    required String url,

    /// Relative path from course's root folder
    required String path,
    required String displayName,
    required String courseName,
    required DateTime createdAt,
  }) async {
    await db.downloadsDao.addToQueue(
      itemId: itemId,
      type: type,
      url: url,
      path: path,
      displayName: displayName,
      courseName: courseName,
      createdAt: createdAt,
    );
  }

  /// Remove item from queue
  Future<void> removeFromQueue(int id) async {
    await db.downloadsDao.removeItem(id);
  }

  // Cleanup download data
  Future<void> cleanupDownload(int id) async {
    // Get item
    final item = await db.downloadsDao.getItem(id);

    if (item == null) {
      return;
    }

    // Delete temp file
    final path = item.tempPath;
    if (path != null) {
      try {
        final f = File(path);
        await f.delete();
      } catch (e) {}
    }

    // Remove record from db
    await db.downloadsDao.removeItem(id);
  }

  /// Handle current item download until completion or error/stop
  Future<void> handleDownload() async {
    // Get downloading item
    final item = await db.downloadsDao.getLatestDownloading();
    if (item == null) {
      return;
    }

    bool done = false;

    while (!done && (runningSubject.value == true)) {
      final status = await handleNextDownloadChunk(item);
      done = status ?? false;
    }
  }

  /// Downloads exactly one chunk, writes it and updates the db.
  ///
  /// If the item is complete (all chunks downloaded) returns `true`,
  /// `otherwise` false.
  ///
  /// If the chunk download encountered an error, returns `null`.
  Future<bool?> handleNextDownloadChunk(DbDownloadItem item) async {
    if (kDebugMode) {
      print("Handling new download");
    }

    final id = item.id;
    final itemId = item.itemId;

    final size = item.totalSize;
    final progress = item.totalDowloaded;
    final itemUrl = item.url;
    final tempPath = item.tempPath;
    final bearerToken = authService.state.token;

    if (size == null ||
        progress == null ||
        tempPath == null ||
        bearerToken == null) {
      await cleanupDownload(id);
      return null;
    }

    // If complete, finalize download and return
    if (progress == size - 1) {
      // Move temp file to final location
      return await (await moveToFinalPath(tempPath, item.path))
          .fold<Future<bool?>>((l) async {
        try {
          await File(tempPath).delete();
          return true;
        } catch (e) {
          return null;
        }
      }, (r) async {
        // If move has been successful, delete record from db
        await db.downloadsDao.removeItem(id);
        return true;
      });
    }

    // Download next chunk

    final startByte = progress;
    final computedEndByte = startByte + chunkSize - 1;
    final realEndByte = size - 1;

    final int endByte = min(realEndByte, computedEndByte);

    try {
      print("Requesting range $startByte-$endByte");

      final res = await http.get(Uri.parse(itemUrl), headers: {
        "Authorization": "Bearer $bearerToken",
        "Range": "bytes=$startByte-$endByte",
      });

      final data = res.bodyBytes;

      return await (await writeChunk(tempPath, startByte, data))
          .fold<FutureOr<bool?>>((l) => null, (r) async {
        // Update db on write success
        await db.downloadsDao.updateItem(
          id: id,
          itemId: itemId,
          status: DbDownloadStatus.downloading,
          totalDownloaded: endByte + 1,
        );
        return false;
      });
    } catch (e) {
      return null;
    }
  }

  /// Initialize next item in queue.
  ///
  /// This does not start a download. It only allocates the temp file,
  /// updates the item with 0 bytes downloaded yet, and marks the item
  /// as "downloading".
  Future<void> initNext() async {
    // Remove next from queue, if any
    final qItem = await db.downloadsDao.getNextInQueue();
    if (qItem == null) {
      return;
    }

    final id = qItem.id;
    final itemId = qItem.itemId;

    // Create temp path
    final tempFilesDir = await getTempFilesBaseDir();
    if (tempFilesDir == null) {
      await cleanupDownload(id);
      return;
    }

    try {
      // Get file size
      final res = await dioW.dio.head(qItem.url);

      print(res.headers);

      final size =
          int.tryParse(res.headers["content-length"]?.elementAtOrNull(0) ?? "");
      final supportsResume =
          res.headers["accept-ranges"]?.elementAtOrNull(0) == "bytes";

      print("Size: $size (${size.runtimeType})");
      print("Supports resume: $supportsResume");

      if (size == null || !supportsResume) {
        await cleanupDownload(id);
        return;
      }

      final tempPath = await createTempFile(tempFilesDir, size);

      if (tempPath == null) {
        await cleanupDownload(id);
        return;
      }

      await db.downloadsDao.updateItem(
        id: id,
        itemId: itemId,
        tempPath: tempPath,
        totalDownloaded: 0,
        totalSize: size,
        status: DbDownloadStatus.downloading,
      );
    } catch (e) {
      await cleanupDownload(id);
      return;
    }
  }

  /// Remove all items from queue and cancel current downloads
  Future<void> cancelAll() async {
    await db.downloadsDao.clearAll();
  }
}

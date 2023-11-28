/// This file contains functions dealing with the filesystem layer
/// of the download manager.

import 'dart:async';
import 'dart:io';
import 'dart:math';

import 'package:open_polito/logic/downloader/download_utils.dart';
import 'package:open_polito/logic/utils/cross_platform.dart';
import 'package:path/path.dart';
import 'package:fpdart/fpdart.dart';
import 'package:path_provider/path_provider.dart';

/// Try to create temp file of specified [size] at [basePath].
///
/// Returns the path of this temp file.
/// Returns null if fails.
Future<String?> createTempFile(String basePath, int size) async {
  final tempName = await createRandomFilename(basePath);
  if (tempName == null) {
    return null;
  }

  // 1. Check if sufficient storage space.
  // For now, just preallocate the file, and if error delete it.
  try {
    final tmpPath = join(basePath, tempName);
    final tmpFile = File(tmpPath);
    final raf = await tmpFile.open(mode: FileMode.write);

    try {
      await raf.truncate(size); // preallocate size
      return tmpPath;
    } catch (e) {
      // Delete file if exception
      await raf.close();
      await tmpFile.delete();
      return null;
    } finally {
      await raf.close();
    }
  } catch (e) {
    return null;
  }
}

/// Creates a random file name of provided [length].
///
/// [basePath] is needed to ensure filename is unique.
///
/// Returns null if error.
Future<String?> createRandomFilename(String basePath, [int length = 8]) async {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  try {
    bool success = false;
    final random = Random.secure();

    while (!success) {
      final path = String.fromCharCodes(Iterable.generate(
          length, (_) => chars.codeUnitAt(random.nextInt(chars.length))));
      final file = File(path);
      final exists = await file.exists();
      if (exists) {
        success = true;
      }
    }
  } catch (e) {
    return null;
  }
  return null;
}

/// Write [bytes] chunk to file at [path] from [offset].
Future<Either<void, void>> writeChunk(
    String path, int offset, List<int> bytes) async {
  try {
    final file = File(path);
    final raf = await file.open(mode: FileMode.write);

    try {
      await raf.setPosition(offset);
      await raf.writeFrom(bytes);
      await raf.close();

      return right(null);
    } catch (e) {
      await raf.close();
      return left(null);
    }
  } catch (e) {
    return left(null);
  }
}

/// Gets app's base directory.
///
/// This is NOT the download base directory,
/// but rather the container directory.
FutureOr<String?> getDataBaseDir() => crossPlatformFutureOr(
      android: () => null,
      iOS: () => null,
      linux: () async => (await getApplicationDocumentsDirectory()).path,
      macOS: () => null,
      windows: () => null,
      web: () => null,
      unknown: () => null,
    );

/// Returns app's downloads base directory.
///
/// This is the base directory where all downloads will be stored.
///
/// The user can sync this directory across multiple devices
/// using third-party tools.
FutureOr<String?> getDownloadsBaseDir() async {
  final dataPath = await getDataBaseDir();
  if (dataPath == null) {
    return null;
  }

  return crossPlatformValue(
    android: () => dataPath,
    iOS: () => dataPath,
    linux: () => join(dataPath, downloadsDirectoryBaseName),
    macOS: () => null,
    windows: () => null,
    web: () => null,
  );
}

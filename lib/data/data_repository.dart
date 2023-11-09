import 'dart:async';
import 'dart:math';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/data/demo_data.dart';
import 'package:open_polito/db/database.dart' as db;
import 'package:open_polito/init.dart';
import 'package:open_polito/logic/auth/auth_service.dart';
import 'package:open_polito/models/converters.dart';
import 'package:open_polito/models/courses.dart';
import 'package:open_polito/api/api_client.dart' as api;
import 'package:open_polito/models/db_converters.dart';
import 'package:open_polito/types.dart';
import 'package:retrofit/retrofit.dart';

part 'data_repository.freezed.dart';

@freezed
class DataWrapper<T> with _$DataWrapper<T> {
  const factory DataWrapper({
    required T? data,
    required Response<T>? res,
    required int sent,
    required int sentTotal,
    required int recv,
    required int recvTotal,
  }) = _DataWrapper;
}

typedef WrapperStream<T> = Stream<DataWrapper<T>>;

@freezed
class InitHomeData with _$InitHomeData {
  const factory InitHomeData({
    required Iterable<CourseOverview> courseOverviews,
    required Map<int, Map<String, CourseDirectoryItem>> fileMapsByCourseId,
  }) = _InitHomeData;
}

class DataRepository {
  api.ApiClient get _api => GetIt.I.get<api.ApiClient>();
  AuthService get _authService => GetIt.I.get<AuthService>();
  db.AppDatabase get _db => GetIt.I.get<db.AppDatabase>();

  bool get isDemo => _authService.isDemo;

  DataRepository._();

  StreamSubscription<AppMode>? _appModeSub;

  static DataRepository init() {
    final instance = DataRepository._();

    // Listen to app mode changes
    instance._appModeSub = getAppModeStream().listen((event) {
      // TODO: uncomment if using stream again
      // final LocalData newState = switch (event) {
      //   AppMode.real => instance._local.state,
      //   AppMode.demo => demoState,
      // };
      // instance._subject.add(newState);
      if (kDebugMode) {
        print("DataRepository: Changed to $event mode");
      }
    });

    return instance;
  }

  /// Wrapper for API requests.
  /// This function is guaranteed to return null if there is no token
  Future<T?> _w<T>(Future<HttpResponse<T>> Function() futureFn) async {
    try {
      final last = _authService.state;
      final token = last.token;
      if (token != null) {
        return (await futureFn()).data;
      }
      return null;
    } catch (e, s) {
      if (kDebugMode) {
        print("An error happened! $e. Trace: $s");
      }
      return null;
    }
  }

  // TODO: proper offline checking
  bool isAppOffline() => false;

  // TODO: separate this function
  Stream<Result<T, void>> withRetries<T>(
      Future<HttpResponse<T>> Function() caller) async* {
    const maxAttempts = 5;

    // TODO: precompute durations?
    Duration getWaitTime(int n) {
      return Duration(milliseconds: 1000 * exp(n) ~/ 8);
    }

    for (int i = 0; i < maxAttempts; i++) {
      if (i > 0) {
        await Future.delayed(getWaitTime(i));
      }
      final data = await _w(caller);
      if (data != null) {
        yield Ok(data);
        return;
      }
    }

    // If we got here, all retries failed.
    yield const Err(null);
    return;
  }

  /// Takes a function [fn] as input:
  /// - if [isDemo] is `true`, does nothing
  /// - otherwise, runs [fn] and returns its Future.
  FutureOr<void> demoNop(FutureOr<void> Function() fn) async {
    if (isDemo) {
      return null;
    }
    return await fn();
  }

  Stream<InitHomeData> initHomeScreen() async* {
    if (isDemo) {
      yield InitHomeData(
          courseOverviews: demoState.overviews,
          fileMapsByCourseId: demoState.dirMapsByCourse);
      return;
    }

    const data = InitHomeData(courseOverviews: [], fileMapsByCourseId: {});

    final overviews = ((await _w(_api.getCourses))?.data)
        ?.map((e) => courseOverviewFromAPI(e));

    if (overviews != null) {
      await _db.coursesDao.deleteCourses();
      await _db.coursesDao
          .addCourses(overviews.map((e) => dbCourseOverview(e)));
      yield data.copyWith(courseOverviews: overviews, fileMapsByCourseId: {});
    }

    if (overviews == null) {
      return;
    }

    // Now for each course:
    // - get files
    final Map<int, Map<String, CourseDirectoryItem>> fileMap = {};

    for (final ov in overviews) {
      // FILES
      final apiFiles = (await _w(() => _api.getCourseFiles(ov.id)))?.data;

      if (apiFiles == null) {
        continue;
      }

      // Delete old files
      await _db.coursesDao.deleteCourseMaterial(courseId: ov.id);

      final map = dirMapFromAPI(apiFiles, ov.id);
      fileMap[ov.id] = map;
      yield (data.copyWith(fileMapsByCourseId: fileMap));
    }

    // Cleanup
    // Delete items for which the course doesn't exist anymore.
    await _db.coursesDao
        .deleteCourseMaterialNotInIds(courseIds: overviews.map((e) => e.id));

    // If we don't have to refetch...
    yield InitHomeData(
      courseOverviews: overviews,
      fileMapsByCourseId: fileMap,
    );
  }
}

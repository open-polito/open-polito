import 'dart:async';
import 'dart:math';

import 'package:dio/dio.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/data/demo_data.dart';
import 'package:open_polito/db/database.dart';
import 'package:open_polito/logic/api.dart';
import 'package:open_polito/logic/auth/auth_service.dart';
import 'package:open_polito/models/models.dart';
import 'package:open_polito/api/api_client.dart';
import 'package:open_polito/types.dart';
import 'package:retrofit/retrofit.dart';

part 'data_repository.freezed.dart';

part 'data_repository_search.dart';

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
    required List<CourseVirtualClassroom> latestClasses,
    required List<CourseFileInfo> latestFiles,
    required Iterable<CourseVirtualClassroom> liveClasses,
  }) = _InitHomeData;
}

/// Throttle timeouts
Map<String, DateTime> _throttleTimes = {};

/// Default throttle timeout
const _defaultTimeout = Duration(seconds: 5);

enum RateLimitingType {
  debounce,
  throttle,
}

enum RateLimitingForceMode {
  api,
  local,
}

class DataRepository {
  ApiClient get api => GetIt.I.get<ApiClient>();
  AuthService get _authService => GetIt.I.get<AuthService>();
  AppDatabase get db => GetIt.I.get<AppDatabase>();

  bool get isDemo => _authService.isDemo;

  DataRepository._();

  static DataRepository init() {
    final instance = DataRepository._();
    return instance;
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
      final data = await req(caller);
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

  /// Function that returns a different value based on the app mode.
  FutureOr<T> demoDefault<T>({
    required FutureOr<T> Function() real,
    required FutureOr<T> Function() demo,
  }) async {
    if (isDemo) {
      return await demo();
    }
    return await real();
  }

  FutureOr<Iterable<CourseOverview>?> getCourses() => demoDefault(
        real: () => _throttle(
          key: "getCourses",
          apiFn: () async => (await req(api.getCourses))
              ?.data
              .map((e) => courseOverviewFromAPI(e)),
          localFn: () async {
            final data = await db.coursesDao.getCourses();
            return data.map((e) => courseOverviewFromDB(e));
          },
          localUpdater: (apiData) async {
            final items = apiData.map((e) => dbCourseOverview(e));
            await db.coursesDao
                .setCourses(items, apiData.map((e) => e.id).nonNulls.toList());
          },
        ),
        demo: () => [],
      );

  FutureOr<Iterable<CourseFileInfo>?> getLatestFiles() => demoDefault(
        real: () async {
          final items = await db.coursesDao.getLatestFiles();
          return items
              .map((e) => courseDirectoryItemFromDB(
                    e.$1,
                    items.map((a) => a.$1),
                    courseName: e.$2,
                  ))
              .whereType<CourseFileInfo>();
        },
        demo: () => [],
      );

  FutureOr<Iterable<CourseVirtualClassroom>?> getLatestVirtualClassrooms() =>
      demoDefault(
        real: () async {
          final items = await db.coursesDao.getLatestRecordedClasses();
          return items.map((e) => vcFromDB(e.$1, courseName: e.$2));
        },
        demo: () => [],
      );

  FutureOr<Iterable<CourseDirectoryItem>?> getCourseMaterial(
    int courseId,
    String courseName, {
    /// Force local fetch
    bool forceLocal = false,

    /// Return paginated, otherwise returns all results
    bool paginated = false,

    /// Page number (only when pagination enabled)
    int pageIndex = 0,

    /// Get only children of this directory
    String? parentId,

    /// Don't use this together with pagination
    int? maxResults,
  }) =>
      demoDefault(
        real: () => _throttle(
          key: "getCourseMaterial_$courseId",
          apiFn: () async =>
              (await req(() => api.getCourseFiles(courseId)))?.data,
          localFn: () async {
            final data = await db.coursesDao.getCourseMaterial(
              courseId: courseId,
              pageIndex: pageIndex,
              paginated: paginated,
              parentId: parentId,
              maxResults: maxResults,
            );

            return data
                .map((e) =>
                    courseDirectoryItemFromDB(e, data, courseName: courseName))
                .nonNulls;
          },
          localUpdater: (apiData) async {
            final items = dbCourseDirItemsFromAPI(apiData,
                courseId: courseId, parentId: null);
            await db.coursesDao.addCourseMaterial(items);
          },
        ),
        demo: () => [],
      );

  FutureOr<Iterable<CourseVirtualClassroom>?> getCourseVirtualClassrooms(
          int courseId, String courseName) =>
      demoDefault(
        real: () => _throttle(
          key: "getCourseVirtualClassrooms_$courseId",
          apiFn: () async =>
              (await req(() => api.getCourseVirtualClassrooms(courseId)))
                  ?.data
                  .map((e) => vcFromAPI(e, courseId, courseName)),
          localFn: () async {
            final data = await db.coursesDao
                .getCourseRecordedClasses(courseId: courseId);
            return data.map((e) => vcFromDB(e, courseName: courseName));
          },
          localUpdater: (apiData) async {
            await db.coursesDao.addCourseRecordedClasses(apiData
                .map((e) => dbCourseRecordedClass(e, courseId))
                .nonNulls);
          },
        ),
        demo: () => [],
      );

  FutureOr<Iterable<CourseVirtualClassroom>?> getCourseLiveClassrooms(
          int courseId, String courseName) =>
      demoDefault(
        real: () async {
          final res = await req(
              () => api.getCourseVirtualClassrooms(courseId, live: true));
          return res?.data.map((e) => vcFromAPI(e, courseId, courseName));
        },
        demo: () => [],
      );

  FutureOr<Iterable<CourseVirtualClassroom>?> getAllLiveClassrooms(
          Iterable<(int, String)> courses) =>
      demoDefault(
        real: () async {
          final vcs = await Future.wait(courses
              .map((c) async => await getCourseLiveClassrooms(c.$1, c.$2)));
          return vcs.nonNulls.expand((element) => element).nonNulls;
        },
        demo: () => [],
      );

  Stream<InitHomeData> initHomeScreen() async* {
    if (isDemo) {
      yield InitHomeData(
        courseOverviews: demoState.overviews,
        latestClasses: demoState.recordedClasses,
        latestFiles: [],
        liveClasses: [],
      );
      return;
    }

    var data = const InitHomeData(
      courseOverviews: [],
      latestClasses: [],
      latestFiles: [],
      liveClasses: [],
    );

    final overviews = await getCourses();

    if (overviews == null) {
      return;
    }

    data = data.copyWith(courseOverviews: overviews);
    yield data;

    for (final ov in overviews) {
      await getCourseMaterial(ov.id, ov.name);
      await getCourseVirtualClassrooms(ov.id, ov.name);
    }

    final latestFiles = await getLatestFiles();
    final latestClasses = await getLatestVirtualClassrooms();
    final liveClasses =
        await getAllLiveClassrooms(overviews.map((e) => (e.id, e.name)));

    data = data.copyWith(
      latestFiles: latestFiles?.toList() ?? [],
      latestClasses: latestClasses?.toList() ?? [],
      liveClasses: liveClasses?.toList() ?? [],
    );
    yield data;
  }

  FutureOr<T?> _throttle<T, R>({
    required String key,
    required FutureOr<R?> Function() apiFn,
    required FutureOr<T?> Function() localFn,
    required FutureOr<void> Function(R apiData) localUpdater,
    Duration timeout = _defaultTimeout,
    RateLimitingForceMode? forceMode,
  }) =>
      _rateLimit(
        type: RateLimitingType.throttle,
        key: key,
        apiFn: apiFn,
        localFn: localFn,
        localUpdater: localUpdater,
        forceMode: forceMode,
      );

  FutureOr<T?> _debounce<T, R>({
    required String key,
    required FutureOr<R?> Function() apiFn,
    required FutureOr<T?> Function() localFn,
    required FutureOr<void> Function(R apiData) localUpdater,
    Duration timeout = _defaultTimeout,
    RateLimitingForceMode? forceMode,
  }) =>
      _rateLimit(
        type: RateLimitingType.debounce,
        key: key,
        apiFn: apiFn,
        localFn: localFn,
        localUpdater: localUpdater,
        forceMode: forceMode,
      );

  /// Generic rate limiting function.
  ///
  /// Do not use directly. Use [_throttle] or [_debounce] instead.
  ///
  /// Based on the selected rate limiting type:
  /// - if it should refresh from API, calls [apiFn], then updates the local data
  ///   by calling [localUpdater]
  /// - always calls [localFn] and returns its result.
  FutureOr<T?> _rateLimit<T, R>({
    required RateLimitingType type,
    required String key,
    required FutureOr<R?> Function() apiFn,
    required FutureOr<T?> Function() localFn,
    required FutureOr<void> Function(R apiData) localUpdater,
    Duration timeout = _defaultTimeout,
    RateLimitingForceMode? forceMode,
  }) async {
    // If demo mode or forcing local mode, then return local immediately
    if (isDemo || forceMode == RateLimitingForceMode.local) {
      return await localFn();
    }
    final now = DateTime.now();
    final lastTimeout = _throttleTimes[key];

    // Call API if any of this applies (by priority):
    // - the API call is forced
    // - no previous timeout exists
    // - the previous timeout expired
    if (forceMode == RateLimitingForceMode.api ||
        lastTimeout == null ||
        now.difference(lastTimeout).compareTo(timeout) >= 0) {
      // Can call API
      final res = await apiFn();
      if (res != null) {
        // API call successful
        await localUpdater(res);

        // Reset throttle
        _throttleTimes[key] = DateTime.now();
      }
    }
    // If debouncing, always need to register new time
    /**
   * TODO: actually you'd need a Timer when debouncing because
   * we always run the latest function if the timer is over.
   */
    if (type == RateLimitingType.debounce) {
      _throttleTimes[key] = DateTime.now();
    }
    // Now fetch locally
    return await localFn();
  }
}

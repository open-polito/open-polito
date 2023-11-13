import 'dart:async';
import 'dart:math';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/api/models/courses.dart' as api_models;
import 'package:open_polito/data/demo_data.dart';
import 'package:open_polito/db/database.dart' as db;
import 'package:open_polito/logic/api.dart';
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
    required List<CourseVirtualClassroom> classes,
    required List<CourseFileInfo> latestFiles,
  }) = _InitHomeData;
}

class DataRepository {
  api.ApiClient get _api => GetIt.I.get<api.ApiClient>();
  AuthService get _authService => GetIt.I.get<AuthService>();
  db.AppDatabase get _db => GetIt.I.get<db.AppDatabase>();

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

  Stream<InitHomeData> initHomeScreen() async* {
    if (isDemo) {
      yield InitHomeData(
        courseOverviews: demoState.overviews,
        fileMapsByCourseId: demoState.dirMapsByCourse,
        classes: demoState.recordedClasses,
        latestFiles: [],
      );
      return;
    }

    var data = const InitHomeData(
      courseOverviews: [],
      fileMapsByCourseId: {},
      classes: [],
      latestFiles: [],
    );

    final overviews = ((await req(_api.getCourses))?.data)
        ?.map((e) => courseOverviewFromAPI(e));

    if (overviews != null) {
      await _db.coursesDao.deleteCourses();
      await _db.coursesDao
          .addCourses(overviews.map((e) => dbCourseOverview(e)));
      data = data.copyWith(courseOverviews: overviews, fileMapsByCourseId: {});
      yield data;
    }

    if (overviews == null) {
      return;
    }

    final Map<int, Map<String, CourseDirectoryItem>> fileMap = {};

    for (final ov in overviews) {
      // FILES
      final [
        apiFiles as List<api_models.CourseDirectoryContent>?,
        apiClasses as List<api_models.VirtualClassroomBase>?,
      ] = await Future.wait([
        req(() => _api.getCourseFiles(ov.id)).then((value) => value?.data),
        req(() => _api.getCourseVirtualClassrooms(ov.id))
            .then((value) => value?.data),
      ]);

      // Process files
      if (apiFiles != null) {
        // Delete old files
        await _db.coursesDao.deleteCourseMaterial(courseId: ov.id);

        final map = dirMapFromAPI(apiFiles, ov.id, courseName: ov.name);
        fileMap[ov.id] = map;
        data = data.copyWith(fileMapsByCourseId: fileMap);
        yield data;

        // Save new material list
        await _db.coursesDao.addCourseMaterial(
            map.values.map((e) => dbCourseDirItem(e, ov.id)));
      }

      final classes = apiClasses?.map((e) => vcFromAPI(e, ov.id, ov.name));

      // Process recorded classes
      final recordedClasses =
          classes?.where((element) => element.isLive == false);
      if (recordedClasses != null) {
        // Delete old classes
        await _db.coursesDao.deleteCourseRecordedClasses(courseId: ov.id);

        data = data.copyWith(classes: [...data.classes, ...recordedClasses]);
        yield data;

        // Save new classes
        await _db.coursesDao.addCourseRecordedClasses(recordedClasses
            .map((e) => dbCourseRecordedClass(e, ov.id))
            .nonNulls);
      }
    }

    // Process latest files
    final latestFiles = (data.fileMapsByCourseId.values
            .map((e) => e.values.map((e) => e))
            .expand((element) => element)
            .whereType<CourseFileInfo>()
            .toList()
          ..sort((a, b) => b.createdAt.difference(a.createdAt).inMilliseconds))
        .take(10)
        .toList();
    data = data.copyWith(
      latestFiles: latestFiles,
    );
    yield data;

    // Sort class recordings
    final recordings = (data.classes.map((e) => e).toList()
          ..sort((a, b) => b.recording!.createdAt
              .difference(a.recording!.createdAt)
              .inMilliseconds))
        .take(10)
        .toList();
    data = data.copyWith(classes: recordings);
    yield data;

    final courseIds = overviews.map((e) => e.id);
    // Cleanup
    // Delete items for which the course doesn't exist anymore.
    await _db.coursesDao.deleteCourseMaterialNotInIds(courseIds: courseIds);
    await _db.coursesDao
        .deleteCourseRecordedClassesNotInIds(courseIds: courseIds);
  }
}

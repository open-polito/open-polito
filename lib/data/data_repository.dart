import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/data/local_data_source.dart';
import 'package:open_polito/logic/app_service.dart';
import 'package:open_polito/models/converters.dart';
import 'package:open_polito/models/courses.dart';
import 'package:open_polito/types.dart';
import 'package:open_polito/api/api_client.dart' as api;
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

abstract class IDataRepository {
  Stream<LocalData> get stream;
  LocalData get state;

  Future<void> initHomeScreen();
}

class DataRepository extends IDataRepository {
  api.ApiClient get _api => GetIt.I.get<api.ApiClient>();
  LocalDataSource get _local => GetIt.I.get<LocalDataSource>();

  @override
  Stream<LocalData> get stream => _local.stream;

  @override
  LocalData get state => _local.state;

  DataRepository._();

  static DataRepository init() {
    return DataRepository._();
  }

  Future<T?> _w<T>(Future<HttpResponse<T>> Function() futureFn) async {
    try {
      final authService = appService.authService;
      final last = authService.state;
      final token = last.token;
      if (token case Ok()) {
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

  @override
  Future<void> initHomeScreen() async {
    // 1. Fetch courses.
    // 2. For each course, fetch:
    //   - live classes
    //   - files
    final courseOverviews = await _w(_api.getCourses).then((res) =>
        (res?.data ?? []).map((overview) => courseOverviewFromAPI(overview)));

    _local.setCourses(
        courseOverviews.map((e) => CourseData(overview: e)).toList());

    final List<Future> futures = [
      ...courseOverviews.map((courseOverview) =>
          _w(() => _api.getCourseVirtualClassrooms(courseOverview.id))
              .then((vcResponse) => _local.setCourseVirtualClassrooms(
                    courseOverview.id,
                    (vcResponse?.data ?? [])
                        .map((vc) => vcFromAPI(vc, courseOverview.id))
                        .toList(),
                  ))),
      ...courseOverviews.map((courseOverview) =>
          _w(() => _api.getCourseFiles(courseOverview.id))
              .then((filesResponse) => _local.setCourseFiles(
                    courseOverview.id,
                    (filesResponse?.data ?? [])
                        .map((file) => fileFromAPI(file, courseOverview.id))
                        .whereType<CourseFileInfo>()
                        .toList(),
                  ))),
    ];

    await Future.wait(futures);
  }
}

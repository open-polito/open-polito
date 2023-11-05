import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/data/demo_data_repository.dart';
import 'package:open_polito/data/local_data_source.dart';
import 'package:open_polito/init.dart';
import 'package:open_polito/logic/auth/auth_service.dart';
import 'package:open_polito/models/converters.dart';
import 'package:open_polito/models/courses.dart';
import 'package:open_polito/api/api_client.dart' as api;
import 'package:open_polito/models/search.dart';
import 'package:retrofit/retrofit.dart';
import 'package:rxdart/subjects.dart';

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

class DataRepository {
  api.ApiClient get _api => GetIt.I.get<api.ApiClient>();
  AuthService get _authService => GetIt.I.get<AuthService>();

  final LocalDataSource _local;

  final BehaviorSubject<LocalData> _subject =
      BehaviorSubject.seeded(GetIt.I.get<LocalDataSource>().state);

  Stream<LocalData> get stream => isDemo ? _subject.stream : _local.stream;

  LocalData get state => isDemo ? _subject.value : _local.state;

  bool get isDemo => _authService.isDemo;

  DataRepository._(this._local);

  StreamSubscription<AppMode>? _appModeSub;

  static DataRepository init({
    required LocalDataSource localDataSource,
  }) {
    final instance = DataRepository._(localDataSource);

    // Listen to app mode changes
    instance._appModeSub = getAppModeStream().listen((event) {
      final LocalData newState = switch (event) {
        AppMode.real => instance._local.state,
        AppMode.demo => demoState,
      };
      instance._subject.add(newState);
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

  /// Takes a function [fn] as input:
  /// - if [isDemo] is `true`, does nothing
  /// - otherwise, runs [fn] and returns its Future.
  FutureOr<void> demoNop(FutureOr<void> Function() fn) async {
    if (isDemo) {
      return null;
    }
    return await fn();
  }

  /// Initialize home screen data
  FutureOr<void> initHomeScreen() => demoNop(() async {
        if (isDemo) {
          return;
        }
        // 1. Fetch courses.
        // 2. For each course, fetch:
        //   - live classes
        //   - files
        final courseOverviews = await getCourses();
        final List<Future> futures = [
          ...courseOverviews.map((courseOverview) async =>
              await getCourseVirtualClassrooms(courseOverview.id)),
          ...courseOverviews.map((courseOverview) async =>
              await getCourseVirtualClassrooms(courseOverview.id)),
        ];
        await Future.wait(futures);
      });

  /// Gets course overviews and updates the stream.
  FutureOr<Iterable<CourseOverview>> getCourses() => _w(_api.getCourses)
          .then((res) => (res?.data ?? [])
              .map((overview) => courseOverviewFromAPI(overview)))
          .then((value) async {
        final data = value.map((e) => CourseData(overview: e)).toList();
        await _local.setCourses(data);
        return value.toList();
      });

  /// Gets course virtual classrooms and updates the stream.
  FutureOr<Iterable<VirtualClassroom>> getCourseVirtualClassrooms(
          int courseId) =>
      _w(() => _api.getCourseVirtualClassrooms(courseId))
          .then((vcResponse) async {
        final data =
            (vcResponse?.data ?? []).map((vc) => vcFromAPI(vc, courseId));
        await _local.setCourseVirtualClassrooms(courseId, data.toList());
        return data;
      });

  /// Gets course files and updates the stream.
  FutureOr<Iterable<CourseFileInfo>> getCourseFiles(int courseId) =>
      _w(() => _api.getCourseFiles(courseId)).then((filesResponse) async {
        final data = (filesResponse?.data ?? [])
            .map((file) => fileFromAPI(file, courseId))
            .whereType<CourseFileInfo>();

        _local.setCourseFiles(courseId, data.toList());

        return data;
      });

  /// Gets search results.
  FutureOr<SearchResult> getSearchResults(
      SearchCategory searchCategory, String search) async {
    // TODO: caching rules

    final FutureOr<SearchResult> res = await switch (searchCategory) {
      // TODO: Handle this case.
      SearchCategory.files => _getFilesSearch(search),
      SearchCategory.recordings => _getRecordingsSearch(search),
      SearchCategory.people => _getPeopleSearch(search),
    };

    return res;
  }

  FutureOr<FilesSearchResult> _getFilesSearch(String search) async {
    // TODO: search query
    final Iterable<Iterable<FileSearchResultItem?>> files =
        await Future.wait(state.coursesById.entries.map((e) async {
      final courseId = e.value.overview?.id;
      if (courseId == null) {
        return [];
      }
      final courseFiles = await getCourseFiles(courseId);
      return courseFiles
          .map((e) => FileSearchResultItem(courseId: courseId, file: e));
    }));
    final mappedFiles = files
        .expand(
          (element) => element,
        )
        .nonNulls;
    return FilesSearchResult(mappedFiles);
  }

  FutureOr<RecordingsSearchResult> _getRecordingsSearch(String search) async {
    return RecordingsSearchResult([]);
    // TODO: search query
    // TODO: analyze API spec to understand which endpoint to call.
    // final Iterable<Iterable<RecordingsSearchResult>> recordings =
    //     await Future.wait(state.coursesById.entries.map((e) async {
    //   final courseId = e.value.overview?.id;
    //   if (courseId == null) {
    //     return [];
    //   }
    //   final courseRecordings = await getcourse
    // }));
  }

  FutureOr<PeopleSearchResult> _getPeopleSearch(String search) async {
    final res = await _w(() => _api.getPeople(search));
    return PeopleSearchResult(res?.data ?? []);
  }
}

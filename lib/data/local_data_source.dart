import 'dart:async';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:rxdart/subjects.dart';
import 'package:open_polito/models/courses.dart';

part 'local_data_source.freezed.dart';

@freezed
class LocalData with _$LocalData {
  const factory LocalData({
    required Map<int, CourseData> coursesById,
  }) = _LocalData;
}

class LocalDataSource {
  final BehaviorSubject<LocalData> _controller;

  Stream<LocalData> get stream => _controller.stream;
  LocalData get state => _controller.value;

  LocalDataSource._(this._controller);

  static LocalDataSource init() {
    // TODO: rehydrate from local DB
    const state = LocalData(coursesById: {1: CourseData()});
    final controller = BehaviorSubject.seeded(state);
    return LocalDataSource._(controller);
  }

  void _update(LocalData Function(LocalData prev) updater) {
    final newState = updater(state);
    _controller.add(newState);
  }

  Future<void> setCourses(List<CourseData> courses) async {
    final filteredCourses =
        courses.where((element) => element.overview != null);
    final newState = state.copyWith(
        coursesById: Map.fromIterables(
            filteredCourses.map((e) => e.overview?.id ?? 0), filteredCourses));
    _update((prev) => newState);
  }

  Future<void> setCourseVirtualClassrooms(
      int courseId, List<VirtualClassroom> vc) async {
    _update((prev) => prev.copyWith(
            coursesById: {
          ...prev.coursesById
        }..update(courseId, (value) => value.copyWith(virtualClassrooms: vc))));
  }

  Future<void> setCourseFiles(int courseId, List<CourseFileInfo> files) async {
    _update((prev) => prev.copyWith(
        coursesById: {...prev.coursesById}
          ..update(courseId, (value) => value.copyWith(files: files))));
  }
}

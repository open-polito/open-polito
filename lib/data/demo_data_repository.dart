import 'dart:async';

import 'package:open_polito/data/data_repository.dart';
import 'package:open_polito/data/local_data_source.dart';
import 'package:open_polito/models/courses.dart';
import 'package:rxdart/rxdart.dart';

class DemoDataRepository implements IDataRepository {
  final BehaviorSubject<LocalData> _controller;

  @override
  LocalData get state => _controller.value;

  @override
  Stream<LocalData> get stream => _controller.stream;

  DemoDataRepository._(this._controller);

  static DemoDataRepository init() {
    final controller = BehaviorSubject<LocalData>.seeded(_demoState);
    return DemoDataRepository._(controller);
  }

  @override
  Future<void> initHomeScreen() {
    return Future.value();
  }
}

final _demoState = LocalData(coursesById: {
  1: CourseData(
    files: [
      CourseFileInfo(
        id: "1",
        name: "Example file ex 1.pdf",
        sizeKB: 14374,
        mimeType: "application/pdf",
        createdAt: DateTime(2023, 10, 20, 12, 20, 54),
      ),
    ],
    overview: const CourseOverview(
        id: 1,
        name: "Course name goes here",
        code: "01abcde",
        cfu: 10,
        teachingPeriod: CourseTeachingPeriod(year: 2023, semester: 1),
        isOverbooking: false,
        isInPersonalStudyPlan: true,
        isModule: false),
    virtualClassrooms: [
      VirtualClassroom(
          courseId: 1,
          isLive: true,
          live: VirtualClassroomLive(
              title: "Live classroom",
              meetingId: "",
              createdAt: DateTime(2023, 10, 24, 14, 34))),
    ],
  ),
});

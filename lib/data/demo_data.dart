import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:open_polito/api/models/models.dart';
import 'package:open_polito/models/models.dart';

part 'demo_data.freezed.dart';

@freezed
class DemoState with _$DemoState {
  const factory DemoState({
    required Iterable<CourseOverview> overviews,
    required Map<int, Map<String, CourseDirectoryItem>> dirMapsByCourse,
    required List<CourseVirtualClassroom> recordedClasses,
  }) = _DemoState;
}

final demoState = DemoState(overviews: [
  const CourseOverview(
      id: 1,
      name: "Course name goes here",
      code: "01abcde",
      cfu: 10,
      teachingPeriod: CourseTeachingPeriod(year: 2023, semester: 1),
      isOverbooking: false,
      isInPersonalStudyPlan: true,
      isModule: false),
], dirMapsByCourse: {
  1: {
    "abcdef": CourseFileInfo(
      id: "1",
      name: "Example file ex 1.pdf",
      sizeKB: BigInt.from(14374),
      mimeType: "application/pdf",
      createdAt: DateTime(2023, 10, 20, 12, 20, 54),
      courseId: 1,
      courseName: "My Course",
    ),
  },
}, recordedClasses: [
  CourseVirtualClassroom(
    courseId: 1,
    isLive: false,
    recording: ApiVirtualClassroom(
      id: 1,
      title: "Example virtual classroom",
      coverUrl: "https://placehold.co/600x400.png",
      videoUrl: "https://example.com",
      createdAt: DateTime.now(),
      duration: "01:19:24",
      type: ApiVirtualClassroomType.recording,
    ),
  ),
]);

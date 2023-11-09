import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:open_polito/models/courses.dart';

part 'demo_data.freezed.dart';

@freezed
class DemoState with _$DemoState {
  const factory DemoState({
    required Iterable<CourseOverview> overviews,
    required Map<int, Map<String, CourseDirectoryItem>> dirMapsByCourse,
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
    ),
  },
});

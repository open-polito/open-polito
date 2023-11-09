import 'package:freezed_annotation/freezed_annotation.dart';

part 'courses.freezed.dart';

@freezed
class CourseOverview with _$CourseOverview {
  const factory CourseOverview({
    required int id,
    required String name,
    required String code,
    required int cfu,
    required CourseTeachingPeriod? teachingPeriod,
    required bool isOverbooking,
    required bool isInPersonalStudyPlan,
    required bool isModule,
    int? moduleNumber,
    String? year,
    int? teacherId,
  }) = _CourseOverview;
}

@freezed
class CourseTeachingPeriod with _$CourseTeachingPeriod {
  const factory CourseTeachingPeriod({
    int? year,
    int? semester,
  }) = _CourseTeachingPeriod;

  static CourseTeachingPeriod? parse(String s) {
    try {
      final parts = s.split("-");
      final year = int.tryParse(parts[0]);
      final semester = int.tryParse(parts[1]);

      if (year == null) {
        return null;
      }

      return CourseTeachingPeriod(year: year, semester: semester);
    } catch (err) {}
    return null;
  }
}

@freezed
class VirtualClassroom with _$VirtualClassroom {
  const factory VirtualClassroom({
    required int courseId,
    required bool isLive,
    VirtualClassroomLive? live,
  }) = _VirtualClassroom;
}

@freezed
class VirtualClassroomLive with _$VirtualClassroomLive {
  const factory VirtualClassroomLive({
    required String title,
    required String meetingId,
    required DateTime createdAt,
  }) = _VirtualClassroomLive;
}

@freezed
sealed class CourseDirectoryItem with _$CourseDirectoryItem {
  const factory CourseDirectoryItem.file({
    required String id,
    String? parentId,
    required String name,
    required BigInt sizeKB,
    required String mimeType,
    required DateTime createdAt,
  }) = CourseFileInfo;

  const factory CourseDirectoryItem.dir({
    required String id,
    String? parentId,
    required Iterable<String> children,
    required String name,
  }) = CourseDirInfo;
}

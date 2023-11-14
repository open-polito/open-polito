import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:open_polito/api/models/models.dart';

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
class CourseVirtualClassroom with _$CourseVirtualClassroom {
  const factory CourseVirtualClassroom({
    required int courseId,
    String? courseName,
    required bool isLive,
    CourseVirtualClassroomLive? live,
    ApiVirtualClassroom? recording,
  }) = _CourseVirtualClassroom;
}

@freezed
class CourseVirtualClassroomLive with _$CourseVirtualClassroomLive {
  const factory CourseVirtualClassroomLive({
    String? title,
    String? meetingId,
    DateTime? createdAt,
  }) = _CourseVirtualClassroomLive;
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
    required int courseId,
    required String courseName,
  }) = CourseFileInfo;

  const factory CourseDirectoryItem.dir({
    required String id,
    String? parentId,
    required Iterable<String> children,
    required String name,
    required int courseId,
    required String courseName,
  }) = CourseDirInfo;
}

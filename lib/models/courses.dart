import 'package:freezed_annotation/freezed_annotation.dart';

part 'courses.freezed.dart';
part 'courses.g.dart';

@freezed
class CourseData with _$CourseData {
  const factory CourseData({
    CourseOverview? overview,
    List<CourseFileInfo>? files,
    // CourseInfo? courseInfo,
    // Guide? courseGuide,
    // @Default([]) List<CourseNotices> notices,
    List<VirtualClassroom>? virtualClassrooms,
    // CoursesCourseIdVideolecturesGet$Response? videoLectures,
  }) = _CourseData;
  factory CourseData.fromJson(Map<String, Object?> json) =>
      _$CourseDataFromJson(json);
}

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
  }) = _CourseOverview;
  factory CourseOverview.fromJson(Map<String, Object?> json) =>
      _$CourseOverviewFromJson(json);
}

@freezed
class CourseTeachingPeriod with _$CourseTeachingPeriod {
  const factory CourseTeachingPeriod({
    required int year,
    int? semester,
  }) = _CourseTeachingPeriod;
  factory CourseTeachingPeriod.fromJson(Map<String, Object?> json) =>
      _$CourseTeachingPeriodFromJson(json);

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
  factory VirtualClassroom.fromJson(Map<String, Object?> json) =>
      _$VirtualClassroomFromJson(json);
}

@freezed
class VirtualClassroomLive with _$VirtualClassroomLive {
  const factory VirtualClassroomLive({
    required String title,
    required String meetingId,
    required DateTime createdAt,
  }) = _VirtualClassroomLive;
  factory VirtualClassroomLive.fromJson(Map<String, Object?> json) =>
      _$VirtualClassroomLiveFromJson(json);
}

@freezed
class CourseFileInfo with _$CourseFileInfo {
  const factory CourseFileInfo({
    required String id,
    required String name,
    required int sizeKB,
    required String mimeType,
    required DateTime createdAt,
  }) = _CourseFileInfo;
  factory CourseFileInfo.fromJson(Map<String, Object?> json) =>
      _$CourseFileInfoFromJson(json);
}

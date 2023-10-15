import 'package:freezed_annotation/freezed_annotation.dart';

part 'courses.freezed.dart';
part 'courses.g.dart';

@freezed
class GetCourses200Response with _$GetCourses200Response {
  const factory GetCourses200Response({
    required List<CourseOverview> data,
  }) = _GetCourses200Response;
  factory GetCourses200Response.fromJson(Map<String, Object?> json) =>
      _$GetCourses200ResponseFromJson(json);
}

@freezed
class GetCourseVirtualClassrooms200Response
    with _$GetCourseVirtualClassrooms200Response {
  const factory GetCourseVirtualClassrooms200Response({
    required List<VirtualClassroomBase> data,
  }) = _GetCourseVirtualClassrooms200Response;
  factory GetCourseVirtualClassrooms200Response.fromJson(
          Map<String, Object?> json) =>
      _$GetCourseVirtualClassrooms200ResponseFromJson(json);
}

@freezed
class CourseOverview with _$CourseOverview {
  const factory CourseOverview({
    int? id,
    required String name,
    required String shortcode,
    required int cfu,
    required String teachingPeriod,
    int? teacherId,
    required List<PreviousCourseEdition> previousEditions,
    required bool isOverBooking,
    required bool isInPersonalStudyPlan,
    required bool isModule,
    int? moduleNumber,
  }) = _CourseOverview;
  factory CourseOverview.fromJson(Map<String, Object?> json) =>
      _$CourseOverviewFromJson(json);
}

@freezed
class PreviousCourseEdition with _$PreviousCourseEdition {
  const factory PreviousCourseEdition({
    required String year,
    required int id,
  }) = _PreviousCourseEdition;
  factory PreviousCourseEdition.fromJson(Map<String, Object?> json) =>
      _$PreviousCourseEditionFromJson(json);
}

@Freezed(unionKey: "type")
class VirtualClassroomBase with _$VirtualClassroomBase {
  @FreezedUnionValue("recording")
  factory VirtualClassroomBase.virtualClassroom({
    required int id,
    required String title,
    required int teacherId,
    required String coverUrl,
    required String videoUrl,
    required String createdAt,
    required String duration,
    required VirtualClassroomType type,
  }) = VirtualClassroom;

  @FreezedUnionValue("live")
  factory VirtualClassroomBase.virtualClassroomLive({
    required int id,
    required String title,
    required int teacherId,
    required String meetingId,
    required String createdAt,
    bool? isLive,
    required VirtualClassroomType type,
  }) = VirtualClassroomLive;

  factory VirtualClassroomBase.fromJson(Map<String, Object?> json) =>
      _$VirtualClassroomBaseFromJson(json);
}

enum VirtualClassroomType {
  live,
  recording,
}

import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:open_polito/logic/json_converters.dart';

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
class GetCourseFiles200Response with _$GetCourseFiles200Response {
  const factory GetCourseFiles200Response({
    required List<CourseDirectoryContent> data,
  }) = _GetCourseFiles200Response;
  factory GetCourseFiles200Response.fromJson(Map<String, Object?> json) =>
      _$GetCourseFiles200ResponseFromJson(json);
}

@freezed
class CourseOverview with _$CourseOverview {
  const factory CourseOverview({
    int? id,
    required String name,
    required String shortcode,
    required int cfu,
    required String teachingPeriod,
    @SafeNullableIntConverter() int? teacherId,
    required List<PreviousCourseEdition> previousEditions,
    required bool isOverBooking,
    required bool isInPersonalStudyPlan,
    required bool isModule,
    int? moduleNumber,
    String? year,
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
sealed class VirtualClassroomBase with _$VirtualClassroomBase {
  @FreezedUnionValue("live")
  const factory VirtualClassroomBase.live({
    required int id,
    required String title,
    @SafeNullableIntConverter() int? teacherId,
    required String meetingId,
    required DateTime createdAt,
    bool? isLive,
    required VirtualClassroomType type,
  }) = VirtualClassroomLive;

  @FreezedUnionValue("recording")
  const factory VirtualClassroomBase.recording({
    required int id,
    required String title,
    @SafeNullableIntConverter() int? teacherId,
    required String coverUrl,
    required String videoUrl,
    required DateTime createdAt,
    required String duration,
    required VirtualClassroomType type,
  }) = VirtualClassroom;

  factory VirtualClassroomBase.fromJson(Map<String, Object?> json) =>
      _$VirtualClassroomBaseFromJson(json);
}

enum VirtualClassroomType {
  live,
  recording,
}

@Freezed(unionKey: "type")
sealed class CourseDirectoryContent with _$CourseDirectoryContent {
  @FreezedUnionValue("directory")
  const factory CourseDirectoryContent.directory({
    required String id,
    required CourseDirectoryContentType type,
    required String name,
    required Iterable<CourseDirectoryContent> files,
  }) = CourseDirectory;

  @FreezedUnionValue("file")
  const factory CourseDirectoryContent.file({
    required String id,
    required CourseDirectoryContentType type,
    required String name,
    required int sizeInKiloBytes,
    required String mimeType,
    required DateTime createdAt,
  }) = CourseFileOverview;

  factory CourseDirectoryContent.fromJson(Map<String, Object?> json) =>
      _$CourseDirectoryContentFromJson(json);
}

enum CourseDirectoryContentType {
  directory,
  file,
}

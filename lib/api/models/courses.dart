import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:open_polito/logic/json_converters.dart';

part 'courses.freezed.dart';
part 'courses.g.dart';

@freezed
class ApiGetCourses200Response with _$ApiGetCourses200Response {
  const factory ApiGetCourses200Response({
    required List<ApiCourseOverview> data,
  }) = _ApiGetCourses200Response;
  factory ApiGetCourses200Response.fromJson(Map<String, Object?> json) =>
      _$ApiGetCourses200ResponseFromJson(json);
}

@freezed
class ApiGetCourseVirtualClassrooms200Response
    with _$ApiGetCourseVirtualClassrooms200Response {
  const factory ApiGetCourseVirtualClassrooms200Response({
    required List<ApiVirtualClassroomBase> data,
  }) = _ApiGetCourseVirtualClassrooms200Response;
  factory ApiGetCourseVirtualClassrooms200Response.fromJson(
          Map<String, Object?> json) =>
      _$ApiGetCourseVirtualClassrooms200ResponseFromJson(json);
}

@freezed
class ApiGetCourseFiles200Response with _$ApiGetCourseFiles200Response {
  const factory ApiGetCourseFiles200Response({
    required List<ApiCourseDirectoryContent> data,
  }) = _ApiGetCourseFiles200Response;
  factory ApiGetCourseFiles200Response.fromJson(Map<String, Object?> json) =>
      _$ApiGetCourseFiles200ResponseFromJson(json);
}

@freezed
class ApiCourseOverview with _$ApiCourseOverview {
  const factory ApiCourseOverview({
    int? id,
    required String name,
    required String shortcode,
    required int cfu,
    required String teachingPeriod,
    @SafeNullableIntConverter() int? teacherId,
    required List<ApiPreviousCourseEdition> previousEditions,
    required bool isOverBooking,
    required bool isInPersonalStudyPlan,
    required bool isModule,
    int? moduleNumber,
    String? year,
  }) = _ApiCourseOverview;
  factory ApiCourseOverview.fromJson(Map<String, Object?> json) =>
      _$ApiCourseOverviewFromJson(json);
}

@freezed
class ApiPreviousCourseEdition with _$ApiPreviousCourseEdition {
  const factory ApiPreviousCourseEdition({
    required String year,
    required int id,
  }) = _ApiPreviousCourseEdition;
  factory ApiPreviousCourseEdition.fromJson(Map<String, Object?> json) =>
      _$ApiPreviousCourseEditionFromJson(json);
}

@Freezed(unionKey: "type")
sealed class ApiVirtualClassroomBase with _$ApiVirtualClassroomBase {
  @FreezedUnionValue("live")
  const factory ApiVirtualClassroomBase.live({
    required int id,
    required String title,
    @SafeNullableIntConverter() int? teacherId,
    required String meetingId,
    required DateTime createdAt,
    bool? isLive,
    required ApiVirtualClassroomType type,
  }) = ApiVirtualClassroomLive;

  @FreezedUnionValue("recording")
  const factory ApiVirtualClassroomBase.recording({
    required int id,
    required String title,
    @SafeNullableIntConverter() int? teacherId,
    required String coverUrl,
    required String videoUrl,
    required DateTime createdAt,
    required String duration,
    required ApiVirtualClassroomType type,
  }) = ApiVirtualClassroom;

  factory ApiVirtualClassroomBase.fromJson(Map<String, Object?> json) =>
      _$ApiVirtualClassroomBaseFromJson(json);
}

enum ApiVirtualClassroomType {
  live,
  recording,
}

@Freezed(unionKey: "type")
sealed class ApiCourseDirectoryContent with _$ApiCourseDirectoryContent {
  @FreezedUnionValue("directory")
  const factory ApiCourseDirectoryContent.directory({
    required String id,
    required ApiCourseDirectoryContentType type,
    required String name,
    required Iterable<ApiCourseDirectoryContent> files,
  }) = ApiCourseDirectory;

  @FreezedUnionValue("file")
  const factory ApiCourseDirectoryContent.file({
    required String id,
    required ApiCourseDirectoryContentType type,
    required String name,
    required int sizeInKiloBytes,
    required String mimeType,
    required DateTime createdAt,
  }) = ApiCourseFileOverview;

  factory ApiCourseDirectoryContent.fromJson(Map<String, Object?> json) =>
      _$ApiCourseDirectoryContentFromJson(json);
}

enum ApiCourseDirectoryContentType {
  directory,
  file,
}

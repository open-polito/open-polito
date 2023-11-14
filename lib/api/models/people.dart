import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:open_polito/logic/json_converters.dart';

part 'people.freezed.dart';
part 'people.g.dart';

/// GET /people
@freezed
class ApiGetPeople200Response with _$ApiGetPeople200Response {
  const factory ApiGetPeople200Response({
    required List<ApiPersonOverview> data,
  }) = _ApiGetPeople200Response;
  factory ApiGetPeople200Response.fromJson(Map<String, Object?> json) =>
      _$ApiGetPeople200ResponseFromJson(json);
}

/// GET /people/{id}
@freezed
class ApiGetPerson200Response with _$ApiGetPerson200Response {
  const factory ApiGetPerson200Response({
    required ApiPerson data,
  }) = _ApiGetPerson200Response;
  factory ApiGetPerson200Response.fromJson(Map<String, Object?> json) =>
      _$ApiGetPerson200ResponseFromJson(json);
}

@freezed
class ApiPersonOverview with _$ApiPersonOverview {
  const factory ApiPersonOverview({
    @SafeNullableIntConverter() int? id,
    String? firstName,
    String? lastName,
    String? picture,
    String? role,
  }) = _ApiPersonOverview;
  factory ApiPersonOverview.fromJson(Map<String, Object?> json) =>
      _$ApiPersonOverviewFromJson(json);
}

@freezed
class ApiPerson with _$ApiPerson {
  const factory ApiPerson({
    // Inherited from [PersonOverview]
    @SafeNullableIntConverter() int? id,
    String? firstName,
    String? lastName,
    String? picture,
    String? role,
    // Own properties
    String? email,
    List<ApiPhoneNumber>? phoneNumbers,
    String? facilityShortName,
    String? profileUrl,
    List<ApiPersonCourse>? courses,
  }) = _ApiPerson;
  factory ApiPerson.fromJson(Map<String, Object?> json) =>
      _$ApiPersonFromJson(json);
}

@freezed
class ApiPhoneNumber with _$ApiPhoneNumber {
  const factory ApiPhoneNumber({
    String? full,
    String? internal,
  }) = _ApiPhoneNumber;
  factory ApiPhoneNumber.fromJson(Map<String, Object?> json) =>
      _$ApiPhoneNumberFromJson(json);
}

@freezed
class ApiPersonCourse with _$ApiPersonCourse {
  const factory ApiPersonCourse({
    @SafeNullableIntConverter() int? id,
    String? shortcode,
    String? name,
    String? role,
    @SafeNullableIntConverter() int? year,
  }) = _ApiPersonCourse;
  factory ApiPersonCourse.fromJson(Map<String, Object?> json) =>
      _$ApiPersonCourseFromJson(json);
}

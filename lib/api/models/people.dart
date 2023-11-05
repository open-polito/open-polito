import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:open_polito/logic/json_converters.dart';

part 'people.freezed.dart';
part 'people.g.dart';

/// GET /people
@freezed
class GetPeople200Response with _$GetPeople200Response {
  const factory GetPeople200Response({
    required List<PersonOverview> data,
  }) = _GetPeople200Response;
  factory GetPeople200Response.fromJson(Map<String, Object?> json) =>
      _$GetPeople200ResponseFromJson(json);
}

/// GET /people/{id}
@freezed
class GetPerson200Response with _$GetPerson200Response {
  const factory GetPerson200Response({
    required Person data,
  }) = _GetPerson200Response;
  factory GetPerson200Response.fromJson(Map<String, Object?> json) =>
      _$GetPerson200ResponseFromJson(json);
}

@freezed
class PersonOverview with _$PersonOverview {
  const factory PersonOverview({
    @SafeNullableIntConverter() int? id,
    String? firstName,
    String? lastName,
    String? picture,
    String? role,
  }) = _PersonOverview;
  factory PersonOverview.fromJson(Map<String, Object?> json) =>
      _$PersonOverviewFromJson(json);
}

@freezed
class Person with _$Person {
  const factory Person({
    // Inherited from [PersonOverview]
    @SafeNullableIntConverter() int? id,
    String? firstName,
    String? lastName,
    String? picture,
    String? role,
    // Own properties
    String? email,
    List<PhoneNumber>? phoneNumbers,
    String? facilityShortName,
    String? profileUrl,
    List<PersonCourse>? courses,
  }) = _Person;
  factory Person.fromJson(Map<String, Object?> json) => _$PersonFromJson(json);
}

@freezed
class PhoneNumber with _$PhoneNumber {
  const factory PhoneNumber({
    String? full,
    String? internal,
  }) = _PhoneNumber;
  factory PhoneNumber.fromJson(Map<String, Object?> json) =>
      _$PhoneNumberFromJson(json);
}

@freezed
class PersonCourse with _$PersonCourse {
  const factory PersonCourse({
    @SafeNullableIntConverter() int? id,
    String? shortcode,
    String? name,
    String? role,
    @SafeNullableIntConverter() int? year,
  }) = _PersonCourse;
  factory PersonCourse.fromJson(Map<String, Object?> json) =>
      _$PersonCourseFromJson(json);
}

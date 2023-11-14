import 'package:freezed_annotation/freezed_annotation.dart';

part 'common.freezed.dart';
part 'common.g.dart';

@freezed
class ApiErrorResponse with _$ApiErrorResponse {
  const factory ApiErrorResponse({
    int? code,
    String? message,
  }) = _ApiErrorResponse;
  factory ApiErrorResponse.fromJson(Map<String, Object?> json) =>
      _$ApiErrorResponseFromJson(json);
}

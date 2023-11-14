import 'package:freezed_annotation/freezed_annotation.dart';

part 'auth.freezed.dart';
part 'auth.g.dart';

@freezed
class ApiLoginRequest with _$ApiLoginRequest {
  const factory ApiLoginRequest({
    required String username,
    required String password,
    ApiClientData? client,
    ApiDeviceData? device,
    required ApiUpdatePreferencesRequest preferences,
  }) = _ApiLoginRequest;
  factory ApiLoginRequest.fromJson(Map<String, Object?> json) =>
      _$ApiLoginRequestFromJson(json);
}

@freezed
class ApiLogin200Response with _$ApiLogin200Response {
  const factory ApiLogin200Response({
    required ApiIdentity data,
  }) = _ApiLogin200Response;
  factory ApiLogin200Response.fromJson(Map<String, Object?> json) =>
      _$ApiLogin200ResponseFromJson(json);
}

@freezed
class ApiClientData with _$ApiClientData {
  const factory ApiClientData({
    required String name,
    String? id,
  }) = _ApiClientData;
  factory ApiClientData.fromJson(Map<String, Object?> json) =>
      _$ApiClientDataFromJson(json);
}

@freezed
class ApiDeviceData with _$ApiDeviceData {
  const factory ApiDeviceData({
    String? name,
    required String platform,
    String? version,
    String? model,
    String? manufacturer,
  }) = _ApiDeviceData;
  factory ApiDeviceData.fromJson(Map<String, Object?> json) =>
      _$ApiDeviceDataFromJson(json);
}

@freezed
class ApiUpdatePreferencesRequest with _$ApiUpdatePreferencesRequest {
  const factory ApiUpdatePreferencesRequest({
    String? fcmRegistrationToken,
    ApiPreferencesLanguage? language,
  }) = _ApiUpdatePreferencesRequest;
  factory ApiUpdatePreferencesRequest.fromJson(Map<String, Object?> json) =>
      _$ApiUpdatePreferencesRequestFromJson(json);
}

enum ApiPreferencesLanguage {
  it,
  en,
}

@freezed
class ApiIdentity with _$ApiIdentity {
  const factory ApiIdentity({
    required String username,
    required String type,
    required String clientId,
    required String token,
  }) = _ApiIdentity;
  factory ApiIdentity.fromJson(Map<String, Object?> json) =>
      _$ApiIdentityFromJson(json);
}

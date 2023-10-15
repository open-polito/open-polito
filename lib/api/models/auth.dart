import 'package:freezed_annotation/freezed_annotation.dart';

part 'auth.freezed.dart';
part 'auth.g.dart';

@freezed
class LoginRequest with _$LoginRequest {
  const factory LoginRequest({
    required String username,
    required String password,
    ClientData? client,
    DeviceData? device,
    required UpdatePreferencesRequest preferences,
  }) = _LoginRequest;
  factory LoginRequest.fromJson(Map<String, Object?> json) =>
      _$LoginRequestFromJson(json);
}

@freezed
class Login200Response with _$Login200Response {
  const factory Login200Response({
    required Identity data,
  }) = _Login200Response;
  factory Login200Response.fromJson(Map<String, Object?> json) =>
      _$Login200ResponseFromJson(json);
}

@freezed
class ClientData with _$ClientData {
  const factory ClientData({
    required String name,
    String? id,
  }) = _ClientData;
  factory ClientData.fromJson(Map<String, Object?> json) =>
      _$ClientDataFromJson(json);
}

@freezed
class DeviceData with _$DeviceData {
  const factory DeviceData({
    String? name,
    required String platform,
    String? version,
    String? model,
    String? manufacturer,
  }) = _DeviceData;
  factory DeviceData.fromJson(Map<String, Object?> json) =>
      _$DeviceDataFromJson(json);
}

@freezed
class UpdatePreferencesRequest with _$UpdatePreferencesRequest {
  const factory UpdatePreferencesRequest({
    String? fcmRegistrationToken,
    PreferencesLanguage? language,
  }) = _UpdatePreferencesRequest;
  factory UpdatePreferencesRequest.fromJson(Map<String, Object?> json) =>
      _$UpdatePreferencesRequestFromJson(json);
}

enum PreferencesLanguage {
  it,
  en,
}

@freezed
class Identity with _$Identity {
  const factory Identity({
    required String username,
    required String type,
    required String clientId,
    required String token,
  }) = _Identity;
  factory Identity.fromJson(Map<String, Object?> json) =>
      _$IdentityFromJson(json);
}

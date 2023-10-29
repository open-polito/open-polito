import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/api/api_client.dart';
import 'package:open_polito/api/models/auth.dart';
import 'package:open_polito/data/key_value_store.dart';
import 'package:open_polito/logic/api.dart';
import 'package:open_polito/types.dart';
import 'package:rxdart/rxdart.dart';
import 'package:open_polito/data/secure_store.dart';
import 'package:open_polito/logic/auth/auth_model.dart';
import 'package:open_polito/logic/deviceinfo_service.dart';

part 'auth_service.freezed.dart';

abstract class IAuthService {
  Stream<AuthServiceState> get stream;
  AuthServiceState get state;

  Future<Result<void, LoginErrorType>> login(
    String username,
    String password, {
    required bool acceptedTermsAndPrivacy,
  });
  Future<void> logout();
  Future<void> invalidate();
}

@freezed
class AuthServiceState with _$AuthServiceState {
  const factory AuthServiceState({
    required Result<bool, void> loggedIn,
    required Result<String?, void> token,
  }) = _AuthServiceState;
}

typedef OnTokenChangedCallback = Future<void> Function(String? token);
typedef OnTokenInvalidCallback = Future<void> Function();

class AuthService implements IAuthService {
  AuthService._({
    required this.dio,
  });

  Dio dio;

  static AuthService init() {
    final authService = AuthService._(dio: Dio());
    final dio = setupDio(
      onTokenInvalid: () async {
        await authService.invalidate();
      },
    );

    authService.dio = dio;

    authService._getToken();
    return authService;
  }

  final _controller = BehaviorSubject<AuthServiceState>.seeded(
      const AuthServiceState(loggedIn: Pending(), token: Pending()));

  @override
  Stream<AuthServiceState> get stream => _controller.stream;

  @override
  AuthServiceState get state => _controller.value;

  ApiClient get _api => GetIt.I.get<ApiClient>();
  KeyValueStore get _keyValueStore => GetIt.I.get<KeyValueStore>();

  ISecureStoreRepository get _secureStore =>
      GetIt.I.get<ISecureStoreRepository>();

  void update(AuthServiceState Function(AuthServiceState s) updater) {
    final newState = updater(_controller.value);
    _controller.add(newState);
  }

  /// Perform log in.
  @override
  Future<Result<void, LoginErrorType>> login(
    String username,
    String password, {
    required bool acceptedTermsAndPrivacy,
  }) async {
    // If ToS/Privacy not accepted, refuse to log in.
    if (!acceptedTermsAndPrivacy) {
      return const Err(LoginErrorType.termsAndPrivacyNotAccepted);
    } else {
      GetIt.I
          .get<KeyValueStore>()
          .setAcceptedTermsAndPrivacy(acceptedTermsAndPrivacy);
    }

    // Username/password validation
    if (username == "" || password == "") {
      return const Err(LoginErrorType.validation);
    }
    try {
      final res = await _api.login(LoginRequest(
          username: username,
          password: password,
          preferences: const UpdatePreferencesRequest(),
          client: const ClientData(name: "open-polito"),
          device: DeviceData(
              manufacturer:
                  await DeviceInfoService.getItem(DeviceInfoKey.manufacturer),
              model: await DeviceInfoService.getItem(DeviceInfoKey.model),
              platform:
                  await DeviceInfoService.getItem(DeviceInfoKey.platform) ?? "",
              name: await DeviceInfoService.getItem(DeviceInfoKey.name),
              version:
                  await DeviceInfoService.getItem(DeviceInfoKey.version))));

      final data = res.data?.data;
      if (data == null) {
        return const Err(LoginErrorType.general);
      }
      // Check if valid user type
      if (data.type != "student") {
        return const Err(LoginErrorType.userTypeNotSupported);
      }

      // Save token etc...
      await _updateToken(data.token);
      await _updateClientId(data.clientId);

      _keyValueStore.setLoggedIn(true);

      return const Ok(null);
    } catch (e, s) {}

    return const Err(LoginErrorType.general);
  }

  @override
  Future<void> logout() async {
    try {
      await _api.logout();
    } catch (e) {
    } finally {
      invalidate();
    }
  }

  Future<void> invalidate() async {
    await Future.wait([
      _removeSecureData(),
      _removeKvData(),
    ]);
    update((s) => s.copyWith(loggedIn: const Ok(false), token: Ok(null)));
  }

  /// Updates token and updates stream state accordingly.
  Future<void> _updateToken(String t) async {
    dio.setToken(t);

    await _secureStore.secureWrite(SecureStoreKey.politoApiToken, t);
    update((s) => s.copyWith(loggedIn: const Ok(true), token: Ok(t)));
  }

  Future<void> _updateClientId(String id) async {
    await _secureStore.secureWrite(SecureStoreKey.politoClientId, id);
  }

  Future<void> _removeSecureData() async {
    await _secureStore.secureDelete(SecureStoreKey.politoApiToken);
    await _secureStore.secureDelete(SecureStoreKey.politoClientId);
  }

  Future<void> _removeKvData() async {
    _keyValueStore.setLoggedIn(false);
  }

  Future<void> _getToken() async {
    final token = await _secureStore.secureRead(SecureStoreKey.politoApiToken);
    if (token == null || token == "") {
      update(
          (s) => s.copyWith(loggedIn: const Ok(false), token: const Ok(null)));
    } else {
      update((s) => s.copyWith(loggedIn: const Ok(true), token: Ok(token)));
    }
  }
}

import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/data/key_value_store.dart';
import 'package:polito_api/polito_api.dart';
import 'package:rxdart/rxdart.dart';
import 'package:open_polito/bloc/auth_bloc.dart';
import 'package:open_polito/data/secure_store_repository.dart';
import 'package:open_polito/init.dart';
import 'package:open_polito/logic/auth/auth_model.dart';
import 'package:open_polito/logic/deviceinfo_service.dart';

part 'auth_service.freezed.dart';
part 'auth_service.g.dart';

class LoginResult {
  final LoginErrorType? err;

  const LoginResult({this.err});
}

abstract class IAuthService {
  Future<void> onTokenInvalid();
  Future<void> onNewToken(String newToken);
  Future<LoginResult> login(
    String username,
    String password, {
    required bool acceptedTermsAndPrivacy,
  });
  Future<void> logout();
}

@freezed
class AuthServiceState with _$AuthServiceState {
  const factory AuthServiceState() = _AuthServiceState;
  factory AuthServiceState.fromJson(Map<String, Object?> json) =>
      _$AuthServiceStateFromJson(json);
}

typedef OnTokenChangedCallback = void Function(String token);

class AuthService implements IAuthService {
  PolitoApi get _api => GetIt.I.get<PolitoApi>();
  AuthBloc get _authBloc => GetIt.I.get<AuthBloc>();
  KeyValueStore get _keyValueStore => GetIt.I.get<KeyValueStore>();
  ISecureStoreRepository _secureStore;

  String? _token;

  Future<void> setToken(String? t) async {
    await _secureStore.secureWrite(SecureStoreKey.politoApiToken, t);
    _token = t;
  }

  AuthService._(this._secureStore);

  static Future<AuthService> init(
      ISecureStoreRepository secureStoreRepository) async {
    final token =
        await secureStoreRepository.secureRead(SecureStoreKey.politoApiToken);
    final authService = AuthService._(secureStoreRepository);
    authService.setToken(token);
    return authService;
  }

  final authServiceState =
      BehaviorSubject<AuthServiceState>.seeded(const AuthServiceState());

  /// When the token is invalid:
  /// 1. Clear credentials from storage
  /// 2. Update BLoC
  @override
  Future<void> onTokenInvalid() async {
    final dataRepository = getIt.get<ISecureStoreRepository>();
    _keyValueStore.setAcceptedTermsAndPrivacy(false);
    _keyValueStore.setLoggedIn(false);
    await Future.wait([dataRepository.clear(), _authBloc.resetState()]);
  }

  @override
  Future<void> onNewToken(String newToken) async {
    setToken(newToken);
  }

  /// Perform log in.
  @override
  Future<LoginResult> login(
    String username,
    String password, {
    required bool acceptedTermsAndPrivacy,
  }) async {
    // If ToS/Privacy not accepted, refuse to log in.
    if (!acceptedTermsAndPrivacy) {
      return const LoginResult(err: LoginErrorType.termsAndPrivacyNotAccepted);
    } else {
      GetIt.I
          .get<KeyValueStore>()
          .setAcceptedTermsAndPrivacy(acceptedTermsAndPrivacy);
    }

    // Username/password validation
    if (username == "" || password == "") {
      return const LoginResult(err: LoginErrorType.validation);
    }
    try {
      final res = await _api.getAuthApi().login(
          loginRequest: (LoginRequestBuilder()
                ..username = username
                ..password = password
                ..client = (ClientBuilder()..name = "open-polito")
                ..device = (DeviceBuilder()
                  ..manufacturer = await DeviceInfoService.getItem(
                      DeviceInfoKey.manufacturer)
                  ..model = await DeviceInfoService.getItem(DeviceInfoKey.model)
                  ..platform =
                      await DeviceInfoService.getItem(DeviceInfoKey.platform) ??
                          ""
                  ..name = await DeviceInfoService.getItem(DeviceInfoKey.name)
                  ..version =
                      await DeviceInfoService.getItem(DeviceInfoKey.version))
                ..preferences = UpdatePreferencesRequestBuilder())
              .build());

      final data = res.data?.data;
      if (data == null) {
        return const LoginResult(err: LoginErrorType.general);
      }
      // Check if valid user type
      if (data.type != "student") {
        return const LoginResult(err: LoginErrorType.userTypeNotSupported);
      }

      // Save token etc...
      await GetIt.I
          .get<ISecureStoreRepository>()
          .saveLoginInfo(clientID: data.clientId, token: data.token);

      _keyValueStore.setLoggedIn(true);

      return const LoginResult(err: null);
    } catch (e, s) {
      print(e);
    }

    return const LoginResult(err: LoginErrorType.general);
  }

  @override
  Future<void> logout() async {
    final dataRepository = GetIt.I.get<ISecureStoreRepository>();
    await Future.wait([_api.getAuthApi().logout(), dataRepository.clear()]);

    _keyValueStore.setLoggedIn(false);
  }
}

import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/api/api_client.dart';
import 'package:open_polito/api/models/auth.dart';
import 'package:open_polito/data/key_value_store.dart';
import 'package:open_polito/init.dart';
import 'package:open_polito/logic/api.dart';
import 'package:open_polito/logic/utils/getters.dart';
import 'package:open_polito/types.dart';
import 'package:rxdart/rxdart.dart';
import 'package:open_polito/data/secure_store.dart';
import 'package:open_polito/logic/auth/auth_model.dart';
import 'package:open_polito/logic/deviceinfo_service.dart';

part 'auth_service.freezed.dart';

typedef OnTokenChangedCallback = Future<void> Function(String? token);
typedef OnTokenInvalidCallback = Future<void> Function();

@freezed
class AuthState with _$AuthState {
  const factory AuthState({
    required AppMode appMode,
    // Persisted
    bool? loggedIn,
    String? token,
    String? clientId,
  }) = _AuthState;
}

/// Hydrate [AuthState] from persistent data.
Future<AuthState> hydrateAuthState() async {
  final kvStore = GetIt.I.get<KvStore>();
  final secureStore = GetIt.I.get<ISecureStore>();

  final kvState = kvStore.state;

  final bool loggedIn = switch (kvState) {
    Ok() => kvState.data.loggedIn ?? false,
    Err() => false,
    Pending() => true,
  };

  final [token, clientId] = await Future.wait([
    secureStore.secureRead(SecureStoreKey.politoApiToken),
    secureStore.secureRead(SecureStoreKey.politoClientId),
  ]);

  return AuthState(
      loggedIn: loggedIn,
      token: token,
      appMode: AppMode.real,
      clientId: clientId);
}

/// Update [AuthState] and persist changes.
FutureOr<AuthState> updateAuthState(
  AuthState prev,
  Updater<AuthState> updater, {
  bool demoMode = false,
}) async {
  final newState = await updater(prev);

  if (demoMode) {
    return newState;
  }

  // Save changes if not in demo mode.

  if (prev.loggedIn != newState.loggedIn) {
    await getKvStore().setLoggedIn(newState.loggedIn ?? false);
  }

  if (prev.token != newState.token) {
    await getSecureStore()
        .secureWrite(SecureStoreKey.politoApiToken, newState.token);
  }

  if (prev.clientId != newState.clientId) {
    await getSecureStore()
        .secureWrite(SecureStoreKey.politoApiToken, newState.clientId);
  }

  return newState;
}

class AuthService {
  final BehaviorSubject<AuthState> _subject;

  AuthService(this._subject);

  AuthState get state => _subject.value;
  Stream<AuthState> get stream => _subject.stream;

  bool get isDemo => state.appMode == AppMode.demo;

  ApiClient get _api => GetIt.I.get<ApiClient>();
  DioWrapper get _dioWrapper => GetIt.I.get<DioWrapper>();

  FutureOr<void> _updater(Updater<AuthState> updater) async {
    if (!isDemo) {
      final newState = await updateAuthState(state, (prev) => updater(prev));
      _subject.add(newState);
    } else {
      _subject.add(await updater(state));
    }
  }

  static Future<AuthService> init() async {
    return AuthService(BehaviorSubject.seeded(await hydrateAuthState()));
  }

  FutureOr<void> setRealMode() =>
      _updater((prev) async => await hydrateAuthState());

  FutureOr<void> setDemoMode() => _updater(
      (prev) => const AuthState(appMode: AppMode.demo, loggedIn: true));

  Future<void> invalidate() async {
    if (isDemo) {
      await _updater((s) => s.copyWith(loggedIn: false, token: null));
    }
    await Future.wait([
      Future(_removeSecureData),
      Future(_removeKvData),
    ]);
    await _updater((s) => s.copyWith(loggedIn: false, token: null));
  }

  FutureOr<Result<void, LoginErrorType>> login(String username, String password,
      {required bool acceptedTermsAndPrivacy}) async {
    // If demo mode, return mock response
    if (isDemo) {
      return const Ok(null);
    }

    // If ToS/Privacy not accepted, refuse to log in.
    if (!acceptedTermsAndPrivacy) {
      return const Err(LoginErrorType.termsAndPrivacyNotAccepted);
    } else {
      GetIt.I
          .get<KvStore>()
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

      final data = res.data.data;
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

      await _updater((prev) => prev.copyWith(loggedIn: true));

      return const Ok(null);
    } catch (e) {
      // print("Error in login: $e. Trace: $s");
    }

    return const Err(LoginErrorType.general);
  }

  Future<void> logout() async {
    try {
      if (!isDemo) {
        await _api.logout();
      }
    } finally {
      invalidate();
    }
  }

  FutureOr<void> _updateToken(String t) async {
    _dioWrapper.setToken(t);
    await _updater((prev) => prev.copyWith(token: t));
  }

  FutureOr<void> _updateClientId(String id) =>
      _updater((prev) => prev.copyWith(clientId: id));

  FutureOr<void> _removeSecureData() => _updater(
        (prev) => prev.copyWith(token: null, clientId: null),
      );

  FutureOr<void> _removeKvData() =>
      _updater((prev) => prev.copyWith(loggedIn: null));
}

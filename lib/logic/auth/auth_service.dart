import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/api/api_client.dart';
import 'package:open_polito/api/models/models.dart';
import 'package:open_polito/data/key_value_store.dart';
import 'package:open_polito/data/secure_store.dart';
import 'package:open_polito/init.dart';
import 'package:open_polito/logic/api.dart';
import 'package:open_polito/logic/utils/getters.dart';
import 'package:open_polito/types.dart';
import 'package:rxdart/rxdart.dart';
import 'package:open_polito/logic/auth/auth_model.dart';
import 'package:open_polito/logic/deviceinfo_service.dart';

part 'auth_service.freezed.dart';

typedef OnTokenChangedCallback = Future<void> Function(String? token);
typedef OnTokenInvalidCallback = Future<void> Function();

/// Authentication state.
@freezed
class AuthState with _$AuthState {
  const factory AuthState({
    //
    // Not persisted
    //

    required AppMode appMode,
    required AuthStatus authStatus,

    //
    // Persisted
    //

    /// Used exclusively to "remember" that the user has logged in,
    /// and, conversely, to check if the user was logged in last time.
    bool? loggedIn,
    String? token,
    String? clientId,
  }) = _AuthState;
}

/// Demo mode default state
const _defaultDemoState =
    AuthState(appMode: AppMode.demo, authStatus: AuthStatus.authorized);

/// Real mode default state
const _defaultRealState =
    AuthState(appMode: AppMode.real, authStatus: AuthStatus.pending);

/// Hydrate [AuthState] from persistent data.
///
/// Pass [initial] because the class has some data that is not persisted.
/// This data might be assigned before hydration.
Future<AuthState> _hydrateAuthState(AuthState initial) async {
  final secureStore = getSecureStore();

  final bool loggedIn = await _getLoggedIn();
  final [token, clientId] = await Future.wait([
    secureStore.secureRead(SecureStoreKey.politoApiToken),
    secureStore.secureRead(SecureStoreKey.politoClientId),
  ]);

  return initial.copyWith(
    loggedIn: loggedIn,
    token: token,
    clientId: clientId,
  );
}

/// Update [AuthState] and persist changes.
FutureOr<AuthState> _updateAuthState(
  AuthState prev,
  Updater<AuthState> updater, {
  required bool demoMode,
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
        .secureWrite(SecureStoreKey.politoClientId, newState.clientId);
  }

  return newState;
}

/// Get loggedIn value from key-value store.
Future<bool> _getLoggedIn() async {
  await for (final kvState in getKvStore().stream) {
    if (kDebugMode) {
      print("[AuthService _getLoggedIn] New kvState: $kvState");
    }
    if (kvState case Ok()) {
      if (kDebugMode) {
        print("[AuthService _getLoggedIn] New kvState is Ok: ${kvState.data}");
      }
      return kvState.data.loggedIn ?? false;
    }
  }
  return false;
}

class AuthService {
  AuthService._();

  /// Auth state. It is assigned with a default value at initialization.
  final BehaviorSubject<AuthState> _subject =
      BehaviorSubject.seeded(_defaultRealState);

  AuthState get state => _subject.value;
  Stream<AuthState> get stream => _subject.stream;

  bool get isDemo => state.appMode == AppMode.demo;

  ApiClient get _api => GetIt.I.get<ApiClient>();
  DioWrapper get _dioWrapper => GetIt.I.get<DioWrapper>();

  FutureOr<void> _updater(Updater<AuthState> updater) async {
    final prevState = state;
    final newState = await updater(prevState);

    if (kDebugMode) {
      print("[AuthService _updater] New state: $newState");
    }

    if (!isDemo) {
      // Update token for DioWrapper
      _dioWrapper.setToken(newState.token ?? "");
      await _updateAuthState(state, (prev) => newState, demoMode: isDemo);
    }

    _subject.add(newState);
  }

  /// Does preliminary checks to determine whether user is authorized
  /// or has to log in. Also handles state hydration, as part of the
  /// auth checking logic.
  Future<void> _authCheckAndHydrate() async {
    await _updater((prev) => prev.copyWith(authStatus: AuthStatus.pending));
    final bool loggedIn = await _getLoggedIn();
    if (kDebugMode) {
      print("[AuthService] loggedIn is $loggedIn");
    }
    if (!loggedIn) {
      // Was not logged in last time, therefore user is not authorized.
      await _updater(
          (prev) => prev.copyWith(authStatus: AuthStatus.unauthorized));
      return;
    }
    // Was logged in last time. To be more confident about this, also check
    // that there is a stored token and client id.
    // This is where we rehydrate the auth state.
    await _updater((prev) => _hydrateAuthState(prev));
    final token = state.token;
    final clientId = state.clientId;
    if (token == null ||
        token.isEmpty ||
        clientId == null ||
        clientId.isEmpty) {
      // At least one of the values is null or empty. User unauthorized.
      await _updater(
          (prev) => prev.copyWith(authStatus: AuthStatus.unauthorized));
      return;
    }
    // Values (token, etc...) are valid too! User is definitely authorized,
    // unless the token has expired, which will be verified when making
    // an API request anyway.
    await _updater((prev) => prev.copyWith(authStatus: AuthStatus.authorized));
  }

  static Future<AuthService> init() async {
    final instance = AuthService._();
    // Run function after returning instance because we don't want to wait
    // for all checks to complete before having an usable instance.
    return instance.._authCheckAndHydrate();
  }

  FutureOr<void> setRealMode() async {
    await _updater((prev) => _defaultRealState);
    // When returning to real mode, we need to check authorization again!
    await _authCheckAndHydrate();
  }

  FutureOr<void> setDemoMode() async {
    await _updater((prev) => _defaultDemoState);
  }

  Future<void> invalidate() async {
    if (!isDemo) {
      await _resetAuthData();
    }
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
      // NOTE: Don't wrap this request with the [req] wrapper function
      // because we don't have a valid token before this request.
      final res = await _api.login(ApiLoginRequest(
          username: username,
          password: password,
          preferences: const ApiUpdatePreferencesRequest(),
          client: const ApiClientData(name: "open-polito"),
          device: ApiDeviceData(
              manufacturer:
                  await DeviceInfoService.getItem(DeviceInfoKey.manufacturer),
              model: await DeviceInfoService.getItem(DeviceInfoKey.model),
              platform:
                  await DeviceInfoService.getItem(DeviceInfoKey.platform) ?? "",
              name: await DeviceInfoService.getItem(DeviceInfoKey.name),
              version:
                  await DeviceInfoService.getItem(DeviceInfoKey.version))));

      final data = res.data.data;
      // Check if valid user type
      if (data.type != "student") {
        return const Err(LoginErrorType.userTypeNotSupported);
      }

      // User is authorized
      await _updater((prev) => prev.copyWith(
            authStatus: AuthStatus.authorized,
            // Next time the app is opened, it will remember that
            // the user has already logged in.
            loggedIn: true,
            // Save token. NOTE: The updater function will take care of
            // updating the token for the DioWrapper too.
            token: data.token,
            clientId: data.clientId,
          ));

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
      await invalidate();
    }
  }

  FutureOr<void> _resetAuthData() => _updater(
        (_) => _defaultRealState.copyWith(authStatus: AuthStatus.unauthorized),
      );
}

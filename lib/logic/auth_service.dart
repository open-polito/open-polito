import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/data/key_value_store.dart';
import 'package:rxdart/rxdart.dart';
import 'package:open_polito/bloc/auth_bloc.dart';
import 'package:open_polito/data/data_repository.dart';
import 'package:open_polito/init.dart';
import 'package:open_polito/logic/auth_model.dart';
import 'package:open_polito/logic/deviceinfo_service.dart';
import 'package:polito_api/polito_api.dart';

part 'auth_service.freezed.dart';
part 'auth_service.g.dart';

class LoginResult {
  final LoginErrorType? err;

  const LoginResult({this.err});
}

abstract class IAuthService {
  Future<void> onTokenInvalid();
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

class AuthService implements IAuthService {
  final PolitoApi api = GetIt.I.get<PolitoApi>();
  final AuthBloc authBloc = GetIt.I.get<AuthBloc>();
  final KeyValueStore keyValueStore = GetIt.I.get<KeyValueStore>();

  final authServiceState =
      BehaviorSubject<AuthServiceState>.seeded(const AuthServiceState());

  /// When the token is invalid:
  /// 1. Clear credentials from storage
  /// 2. Update BLoC
  @override
  Future<void> onTokenInvalid() async {
    final dataRepository = getIt.get<IDataRepository>();
    keyValueStore.setAcceptedTermsAndPrivacy(false);
    keyValueStore.setLoggedIn(false);
    await Future.wait([dataRepository.clearLoginInfo(), authBloc.resetState()]);
  }

  AuthService();

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

    final req = (LoginRequestBuilder()
          ..username = username
          ..password = password
          ..client = (ClientBuilder()
            ..id = null
            ..name = "open-polito")
          ..device = (DeviceBuilder()
            ..manufacturer =
                await DeviceInfoService.getItem(DeviceInfoKey.manufacturer)
            ..model = await DeviceInfoService.getItem(DeviceInfoKey.model)
            ..platform = await DeviceInfoService.getItem(DeviceInfoKey.platform)
            ..name = await DeviceInfoService.getItem(DeviceInfoKey.name)
            ..version = await DeviceInfoService.getItem(DeviceInfoKey.version))
        // TODO: preferences
        )
        .build();
    try {
      final res = await api.getAuthApi().login(loginRequest: req);

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
          .get<IDataRepository>()
          .saveLoginInfo(clientID: data.clientId, token: data.token);

      keyValueStore.setLoggedIn(true);

      return const LoginResult(err: null);
    } catch (e) {
      if (e is DioException) {}
    }

    return const LoginResult(err: LoginErrorType.general);
  }

  @override
  Future<void> logout() async {
    final dataRepository = GetIt.I.get<IDataRepository>();
    await Future.wait(
        [api.getAuthApi().logout(), dataRepository.clearLoginInfo()]);

    keyValueStore.setLoggedIn(false);
  }
}

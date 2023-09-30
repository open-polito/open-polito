import 'dart:async';

import 'package:dio/dio.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/bloc/auth_bloc.dart';
import 'package:open_polito/data/data_repository.dart';
import 'package:open_polito/init.dart';
import 'package:open_polito/logic/auth_model.dart';
import 'package:open_polito/logic/deviceinfo_service.dart';
import 'package:polito_api/polito_api.dart';

class LoginResult {
  final LoginErrorType? err;

  const LoginResult({this.err});
}

abstract class IAuthService {
  Future<void> onTokenInvalid();
  Future<LoginResult> login(String username, String password);
  Future<void> logout();
}

class AuthService implements IAuthService {
  final PolitoApi api = GetIt.I.get<PolitoApi>();
  final AuthBloc authBloc = GetIt.I.get<AuthBloc>();

  /// When the token is invalid:
  /// 1. Clear credentials from storage
  /// 2. Update BLoC
  @override
  Future<void> onTokenInvalid() async {
    final dataRepository = getIt.get<IDataRepository>();
    await Future.wait([dataRepository.clearLoginInfo(), authBloc.resetState()]);
  }

  AuthService();

  @override
  Future<LoginResult> login(String username, String password) async {
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

      return const LoginResult(err: null);
    } catch (e) {
      if (e is DioException) {}
    }

    return const LoginResult(err: LoginErrorType.general);
  }

  @override
  Future<void> logout() async {
    // TODO: implement logout
    throw UnimplementedError();
  }
}

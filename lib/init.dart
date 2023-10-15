import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/bloc/auth_bloc.dart';
import 'package:open_polito/bloc/home_screen_bloc.dart';
import 'package:open_polito/bloc/login_screen_bloc.dart';
import 'package:open_polito/bloc/theme_bloc.dart';
import 'package:open_polito/data/data_repository.dart';
import 'package:open_polito/data/secure_store_repository.dart';
import 'package:open_polito/data/key_value_store.dart';
import 'package:open_polito/logic/auth/auth_service.dart';
import 'package:polito_api/polito_api.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';

typedef OnNewTokenCallback = void Function(String newToken);
typedef OnTokenInvalidCallback = void Function();

class ApiWrapper {
  final PolitoApi api;
  final OnNewTokenCallback onNewToken;
  final OnTokenInvalidCallback onTokenInvalid;

  ApiWrapper._({
    required this.api,
    required this.onNewToken,
    required this.onTokenInvalid,
  });

  static ApiWrapper init(
      {required OnNewTokenCallback onNewToken,
      required OnTokenInvalidCallback onTokenInvalid}) {
    final dio = Dio(BaseOptions(baseUrl: PolitoApi.basePath));

    dio.interceptors.addAll([
      InterceptorsWrapper(
        onError: (e, handler) async {
          if (e.response?.statusCode == 401) {
            onTokenInvalid();
          }
          return handler.next(e);
        },
      ),
      PrettyDioLogger(
        requestHeader: true,
        requestBody: true,
        responseHeader: true,
        responseBody: true,
        request: true,
      ),
    ]);

    final api = PolitoApi(dio: dio);

    return ApiWrapper._(
        api: api, onNewToken: onNewToken, onTokenInvalid: onTokenInvalid);
  }
}

final getIt = GetIt.instance;

/// Configures dependencies with get_it, and other things.
///
/// The order of registration doesn't matter, as long as the instances
/// don't require a dependency with get_it during initialization.
Future<void> configureStuff() async {
  // Repositories
  final secureStoreRepository = await SecureStoreRepository.init();
  getIt.registerSingleton<ISecureStoreRepository>(secureStoreRepository);
  final keyValueStore = await KeyValueStore.init();
  getIt.registerSingleton<KeyValueStore>(keyValueStore);
  final dataRepository = DataRepository();
  getIt.registerSingleton<IDataRepository>(dataRepository);

  // Services
  final authService = await AuthService.init(secureStoreRepository);
  getIt.registerSingleton<IAuthService>(authService);

  // API
  final apiWrapper = ApiWrapper.init(
      onNewToken: authService.onNewToken,
      onTokenInvalid: authService.onTokenInvalid);
  getIt.registerSingleton<PolitoApi>(apiWrapper.api);

  // BLoCs
  final themeBloc = ThemeBloc();
  getIt.registerSingleton<ThemeBloc>(themeBloc);
  final authBloc = AuthBloc();
  getIt.registerSingleton<AuthBloc>(authBloc);
  final loginScreenBloc = LoginScreenBloc();
  getIt.registerSingleton<LoginScreenBloc>(loginScreenBloc);

  getIt.registerLazySingleton<HomeScreenBloc>(() => HomeScreenBloc());

  if (kDebugMode) {
    // await secureStoreRepository.clear();
    // await keyValueStore.clear();
  }
}

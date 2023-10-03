import 'dart:io';

import 'package:dio/dio.dart';
import 'package:dio_cache_interceptor/dio_cache_interceptor.dart';
import 'package:dio_cache_interceptor_db_store/dio_cache_interceptor_db_store.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/bloc/auth_bloc.dart';
import 'package:open_polito/bloc/data_bloc.dart';
import 'package:open_polito/bloc/login_screen_bloc.dart';
import 'package:open_polito/data/data_repository.dart';
import 'package:open_polito/data/key_value_store.dart';
import 'package:open_polito/logic/auth_service.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as path;
import 'package:polito_api/polito_api.dart';

final getIt = GetIt.instance;

/// Configures dependencies with get_it.
///
/// The order of registration doesn't matter, as long as the instances
/// don't require a dependency with get_it during initialization.
Future<void> configureDependencies() async {
  final api = PolitoApi(
      dio: Dio(BaseOptions(
          baseUrl: PolitoApi.basePath,
          connectTimeout: const Duration(seconds: 10),
          sendTimeout: const Duration(seconds: 10),
          receiveTimeout: const Duration(seconds: 10))));
  getIt.registerSingleton<PolitoApi>(api);

  // BLoCs
  final authBloc = AuthBloc();
  getIt.registerSingleton<AuthBloc>(authBloc);
  final dataBloc = DataBloc();
  getIt.registerSingleton<DataBloc>(dataBloc);
  final loginScreenBloc = LoginScreenBloc();
  getIt.registerSingleton<LoginScreenBloc>(loginScreenBloc);

  // Repositories
  final dataRepository = await DataRepository.init();
  getIt.registerSingleton<IDataRepository>(dataRepository);
  final keyValueStore = await KeyValueStore.init();
  getIt.registerSingleton<KeyValueStore>(keyValueStore);

  // Services
  final authService = AuthService();
  getIt.registerSingleton<IAuthService>(authService);

  // Final configuration
  configureApi(api: api, onTokenInvalid: authService.onTokenInvalid);
}

/// Configures the API code and registers any interceptors with callbacks.
/// Params:
/// - [api] is the API instance
/// - [onTokenInvalid] is a callback run when the API gets a
///   `401 Unauthorized` error and thus the token is invalid
Future<void> configureApi({
  required PolitoApi api,
  required Future<void> Function() onTokenInvalid,
}) async {
  // Setup dio interceptors

  // My custom callbacks
  api.dio.interceptors.add(InterceptorsWrapper(
    onError: (e, handler) async {
      if (e.response?.statusCode == 401) {
        await onTokenInvalid();
      }
      return handler.next(e);
    },
  ));

  // Caching interceptor
  api.dio.interceptors.add(
    DioCacheInterceptor(
      options: CacheOptions(
        store: DbCacheStore(
          databasePath: path
              .join((await getApplicationCacheDirectory()).path, "open_polito")
              .toString(),
        ),
        policy: CachePolicy.refresh,
        hitCacheOnErrorExcept: [HttpStatus.unauthorized, HttpStatus.forbidden],
        cipher: null,
        keyBuilder: CacheOptions.defaultCacheKeyBuilder,
        allowPostMethod: false,
      ),
    ),
  );
}

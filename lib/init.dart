import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/api/api_client.dart';
import 'package:open_polito/bloc/auth_bloc.dart';
import 'package:open_polito/bloc/home_screen_bloc.dart';
import 'package:open_polito/bloc/theme_bloc.dart';
import 'package:open_polito/data/data_repository.dart';
import 'package:open_polito/data/local_data_source.dart';
import 'package:open_polito/data/secure_store.dart';
import 'package:open_polito/data/key_value_store.dart';
import 'package:open_polito/logic/api.dart';
import 'package:open_polito/logic/auth/auth_service.dart';
import 'package:rxdart/subjects.dart';

enum AppMode {
  real,
  demo,
}

final getIt = GetIt.instance..allowReassignment = true;

final _appModeController = BehaviorSubject.seeded(AppMode.real);
Stream<AppMode> getAppModeStream() => _appModeController.stream;
AppMode getAppMode() => _appModeController.value;

/// Configures dependencies with get_it, and other things.
///
/// The order of registration doesn't matter, as long as the instances
/// don't require a dependency with get_it during initialization.
Future<void> configureStuff() async {
  // Repositories
  final secureStoreRepository = SecureStore.init();
  getIt.registerSingleton<ISecureStore>(secureStoreRepository);

  final keyValueStore = await KvStore.init();
  getIt.registerSingleton<KvStore>(keyValueStore);

  // Data source
  final localDataSource = LocalDataSource.init();
  getIt.registerSingleton<LocalDataSource>(localDataSource);

  final dataRepository = DataRepository.init(localDataSource: localDataSource);
  getIt.registerSingleton<DataRepository>(dataRepository);

  // Dio
  final dio = Dio();
  final dioWrapper = DioWrapper(dio);

  // Auth service
  final authService = await AuthService.init();
  dioWrapper.onTokenInvalid = () async {
    await authService.invalidate();
  };
  getIt.registerSingleton<AuthService>(authService);
  getIt.registerSingleton<DioWrapper>(dioWrapper);

  // API
  final api = ApiClient(dio);
  getIt.registerSingleton<ApiClient>(api);

  // BLoCs
  final themeBloc = ThemeBloc();
  getIt.registerSingleton<ThemeBloc>(themeBloc);
  final authBloc = AuthBloc();
  getIt.registerSingleton<AuthBloc>(authBloc);

  getIt.registerSingleton<HomeScreenBloc>(HomeScreenBloc());

  if (kDebugMode) {
    // await secureStoreRepository.clear();
    // await keyValueStore.clear();
  }
}

/// Changes app mode (demo/real)
void setAppMode(AppMode mode) {
  _appModeController.add(mode);
}

import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/api/api_client.dart';
import 'package:open_polito/bloc/auth_bloc.dart';
import 'package:open_polito/bloc/home_screen_bloc.dart';
import 'package:open_polito/bloc/theme_bloc.dart';
import 'package:open_polito/data/data_repository.dart';
import 'package:open_polito/db/database.dart';
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

/// Configures dependencies with get_it, and other things.
///
/// The order of registration doesn't matter, as long as the instances
/// don't require a dependency with get_it during initialization.
Future<void> configureStuff() async {
  // Storage
  final secureStoreRepository = SecureStore.init();
  getIt.registerSingleton<ISecureStore>(secureStoreRepository);

  final keyValueStore = await KvStore.init();
  getIt.registerSingleton<KvStore>(keyValueStore);

  // Database
  final database = AppDatabase();
  getIt.registerSingleton<AppDatabase>(database);

  // Dio
  final dio = Dio();
  final dioWrapper = DioWrapper(dio);
  getIt.registerSingleton<DioWrapper>(dioWrapper);

  // Auth service
  final authService = await AuthService.init();
  dioWrapper.onTokenInvalid = () async {
    await authService.invalidate();
  };
  getIt.registerSingleton<AuthService>(authService);

  // Repositories

  final dataRepository = DataRepository.init();
  getIt.registerSingleton<DataRepository>(dataRepository);

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

import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/api/api_client.dart';
import 'package:open_polito/bloc/auth_bloc.dart';
import 'package:open_polito/bloc/home_screen_bloc.dart';
import 'package:open_polito/bloc/theme_bloc.dart';
import 'package:open_polito/data/local_data_source.dart';
import 'package:open_polito/data/secure_store.dart';
import 'package:open_polito/data/key_value_store.dart';
import 'package:open_polito/logic/app_service.dart';
import 'package:open_polito/logic/auth/auth_service.dart';

final getIt = GetIt.instance..allowReassignment = true;

/// Configures dependencies with get_it, and other things.
///
/// The order of registration doesn't matter, as long as the instances
/// don't require a dependency with get_it during initialization.
Future<void> configureStuff() async {
  // Repositories
  final secureStoreRepository = SecureStoreRepository.init();
  getIt.registerSingleton<ISecureStoreRepository>(secureStoreRepository);

  final keyValueStore = await KeyValueStore.init();
  getIt.registerSingleton<KeyValueStore>(keyValueStore);

  // Data source
  getIt.registerSingleton<LocalDataSource>(LocalDataSource.init());

  // Set App to Account mode
  appService.setMode(AppMode.account);

  // API
  final api = ApiClient((appService.authService as AuthService).dio);
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

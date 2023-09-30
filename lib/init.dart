import 'package:dio/dio.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/bloc/auth_bloc.dart';
import 'package:open_polito/data/data_repository.dart';
import 'package:open_polito/data/secure_store.dart';
import 'package:open_polito/logic/auth_service.dart';
import 'package:polito_api/polito_api.dart';

final getIt = GetIt.instance;

/// Configures dependencies with get_it.
///
/// The order of registration doesn't matter, as long as the instances
/// don't require a dependency with get_it during initialization.
Future<void> configureDependencies() async {
  final api = PolitoApi();
  getIt.registerSingleton<PolitoApi>(api);

  // BLoCs
  final authBloc = AuthBloc();
  getIt.registerSingleton<AuthBloc>(authBloc);

  // Repositories
  final dataRepository = DataRepository(SecureStore.init());
  getIt.registerSingleton<IDataRepository>(dataRepository);

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
  // API instance
  final api = PolitoApi();
  // Setup dio interceptors
  api.dio.interceptors.add(InterceptorsWrapper(
    onError: (e, handler) async {
      if (e.response?.statusCode == 401) {
        await onTokenInvalid();
      }
      return handler.next(e);
    },
  ));
}

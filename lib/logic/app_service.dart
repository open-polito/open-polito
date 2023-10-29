import 'dart:async';

import 'package:open_polito/data/data_repository.dart';
import 'package:open_polito/data/demo_data_repository.dart';
import 'package:open_polito/data/local_data_source.dart';
import 'package:open_polito/logic/auth/auth_service.dart';
import 'package:open_polito/logic/auth/demo_auth_service.dart';
import 'package:rxdart/subjects.dart';

enum AppMode {
  account,
  demo,
}

class AppService {
  IAuthService _authService;
  IDataRepository _dataRepository;

  IAuthService get authService => _authService;
  IDataRepository get dataRepository => _dataRepository;

  Stream<AuthServiceState> get authStream => _authSubject.stream;
  Stream<LocalData> get localDataStream => _dataSubject.stream;

  StreamSubscription<AuthServiceState> _authSubscription;
  StreamSubscription<LocalData> _localDataSubscription;

  final BehaviorSubject<AuthServiceState> _authSubject;
  final BehaviorSubject<LocalData> _dataSubject;

  AppService._({
    required IAuthService authService,
    required IDataRepository dataRepository,
    required Stream<AuthServiceState> authStream,
    required Stream<LocalData> localDataStream,
    required StreamSubscription<AuthServiceState> authSubscription,
    required StreamSubscription<LocalData> localDataSubscription,
    required BehaviorSubject<AuthServiceState> authSubject,
    required BehaviorSubject<LocalData> dataSubject,
  })  : _authSubscription = authSubscription,
        _localDataSubscription = localDataSubscription,
        _authSubject = authSubject,
        _dataSubject = dataSubject,
        _authService = authService,
        _dataRepository = dataRepository;

  // Init in account mode
  static AppService init() {
    final authService = AuthService.init();
    final dataRepository = DataRepository.init();
    final authSubject = BehaviorSubject.seeded(authService.state);
    final dataSubject = BehaviorSubject.seeded(dataRepository.state);
    final authSub = authService.stream.listen((event) {
      authSubject.add(event);
    });
    final dataSub = dataRepository.stream.listen((event) {
      dataSubject.add(event);
    });
    return AppService._(
      authService: authService,
      dataRepository: dataRepository,
      authStream: authService.stream,
      localDataStream: dataRepository.stream,
      authSubscription: authSub,
      localDataSubscription: dataSub,
      authSubject: authSubject,
      dataSubject: dataSubject,
    );
  }

  void setMode(AppMode mode) {
    switch (mode) {
      case AppMode.account:
        _set(
            authService: AuthService.init(),
            dataRepository: DataRepository.init());
        return;
      case AppMode.demo:
        _set(
            authService: DemoAuthService(),
            dataRepository: DemoDataRepository.init());
        return;
    }
  }

  void _set({
    required IAuthService authService,
    required IDataRepository dataRepository,
  }) {
    // Cancel previous subscriptions, if any
    _authSubscription.cancel();
    _localDataSubscription.cancel();

    // Set new instances
    _authService = authService;
    _dataRepository = dataRepository;

    _authSubject.add(authService.state);
    _dataSubject.add(dataRepository.state);

    // Set new subscriptions
    _authSubscription = authService.stream.listen((event) {
      _authSubject.add(event);
    });
    _localDataSubscription = dataRepository.stream.listen((event) {
      _dataSubject.add(event);
    });
  }
}

final appService = AppService.init();

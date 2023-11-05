import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/data/data_repository.dart';
import 'package:open_polito/data/local_data_source.dart';
import 'package:open_polito/logic/auth/auth_service.dart';
import 'package:open_polito/models/courses.dart';

part 'home_screen_bloc.freezed.dart';

@freezed
class HomeScreenBlocState with _$HomeScreenBlocState {
  const factory HomeScreenBlocState({
    required Stream<LocalData> data,
    required List<VirtualClassroomLive> virtualClassrooms,
  }) = _HomeScreenBlocState;
}

class HomeScreenBloc extends Cubit<HomeScreenBlocState> {
  HomeScreenBloc()
      : super(HomeScreenBlocState(
            data: GetIt.I.get<DataRepository>().stream, virtualClassrooms: []));

  StreamSubscription<LocalData>? sub;

  Future<void> init() async {
    await GetIt.I.get<DataRepository>().initHomeScreen();
  }

  Future<void> resetAll({
    required Function() gotoLogin,
  }) async {
    await GetIt.I.get<AuthService>().logout();
    gotoLogin();
  }

  @override
  Future<void> close() {
    sub?.cancel();
    return super.close();
  }
}

import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:open_polito/data/local_data_source.dart';
import 'package:open_polito/logic/app_service.dart';
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
            data: appService.localDataStream, virtualClassrooms: []));

  StreamSubscription<LocalData>? sub;

  Future<void> init() async {
    await appService.dataRepository.initHomeScreen();
  }

  Future<void> resetAll({
    required Function() gotoLogin,
  }) async {
    await appService.authService.logout();
    gotoLogin();
  }

  @override
  Future<void> close() {
    sub?.cancel();
    return super.close();
  }
}

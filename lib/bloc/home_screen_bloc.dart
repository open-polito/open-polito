import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/data/data_repository.dart';
import 'package:open_polito/logic/auth/auth_service.dart';
import 'package:open_polito/models/models.dart';

part 'home_screen_bloc.freezed.dart';

@freezed
class HomeScreenBlocState with _$HomeScreenBlocState {
  const factory HomeScreenBlocState({
    required bool initialized,
    required Iterable<CourseOverview> courseOverviews,
    required List<CourseVirtualClassroom> classes,
    required List<CourseFileInfo> latestFiles,
  }) = _HomeScreenBlocState;
}

class HomeScreenBloc extends Cubit<HomeScreenBlocState> {
  HomeScreenBloc()
      : super(const HomeScreenBlocState(
            initialized: false,
            courseOverviews: [],
            classes: [],
            latestFiles: []));

  Future<void> init() async {
    if (state.initialized) {
      return;
    }
    emit(state.copyWith(initialized: true));
    await for (final d in GetIt.I.get<DataRepository>().initHomeScreen()) {
      emit(
        state.copyWith(
          courseOverviews: d.courseOverviews,
          classes: d.latestClasses,
          latestFiles: d.latestFiles,
        ),
      );
    }
  }

  Future<void> resetAll({
    required Function() gotoLogin,
  }) async {
    await GetIt.I.get<AuthService>().logout();
    gotoLogin();
  }
}

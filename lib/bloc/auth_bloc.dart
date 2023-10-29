import 'package:bloc/bloc.dart';
import 'package:flutter/foundation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:open_polito/logic/app_service.dart';
import 'package:open_polito/types.dart';

part 'auth_bloc.freezed.dart';

@freezed
class AuthBlocState with _$AuthBlocState {
  const factory AuthBlocState({
    @Default(Ok(true)) Result<bool, void> loggedIn,
  }) = _AuthState;
}

class AuthBloc extends Cubit<AuthBlocState> {
  AuthBloc()
      : super(
          const AuthBlocState(),
        );

  Future<void> init() async {
    appService.authStream.listen((event) {
      emit(state.copyWith(loggedIn: event.loggedIn));
    });
  }
}

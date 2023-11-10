import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:flutter/foundation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/logic/auth/auth_model.dart';
import 'package:open_polito/logic/auth/auth_service.dart';

part 'auth_bloc.freezed.dart';

@freezed
class AuthBlocState with _$AuthBlocState {
  const factory AuthBlocState({
    required AuthStatus authStatus,
  }) = _AuthState;
}

class AuthBloc extends Cubit<AuthBlocState> {
  StreamSubscription? _sub;

  AuthBloc()
      : super(
          const AuthBlocState(authStatus: AuthStatus.pending),
        );

  Future<void> init() async {
    _sub = GetIt.I.get<AuthService>().stream.listen((event) {
      emit(state.copyWith(authStatus: event.authStatus));
    });
  }

  @override
  Future<void> close() {
    _sub?.cancel();
    return super.close();
  }
}

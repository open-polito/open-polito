import 'package:bloc/bloc.dart';
import 'package:flutter/foundation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/data/key_value_store.dart';
import 'package:open_polito/logic/auth/auth_model.dart';
import 'package:open_polito/logic/auth/auth_service.dart';

part 'auth_bloc.freezed.dart';

@freezed
class AuthBlocState with _$AuthBlocState {
  const factory AuthBlocState({
    KeyValueStoreData? data,
    LoginErrorType? loginErrorType,
    @Default(LoginStatus.idle) LoginStatus loginStatus,
  }) = _AuthState;
}

class AuthBloc extends Cubit<AuthBlocState> {
  AuthBloc()
      : super(
          const AuthBlocState(),
        );

  Future<void> init() async {
    final data = GetIt.I.get<KeyValueStore>().data;
    data.listen((event) {
      emit(state.copyWith(data: event));
    });
  }

  Future<void> login(
      String username, String password, bool acceptedTermsAndPrivacy) async {
    final authService = GetIt.I.get<IAuthService>();
    emit(state.copyWith(
      loginStatus: LoginStatus.pending,
      loginErrorType: null,
    ));

    final loginResult = await authService.login(
      username,
      password,
      acceptedTermsAndPrivacy: acceptedTermsAndPrivacy,
    );
    final err = loginResult.err;
    if (err == null) {
      emit(state.copyWith(loginStatus: LoginStatus.ok));
      return;
    }

    // There was an error
    emit(state.copyWith(
      loginStatus: LoginStatus.error,
      loginErrorType: err,
    ));
  }

  Future<void> resetState() async {
    emit(const AuthBlocState());
  }
}

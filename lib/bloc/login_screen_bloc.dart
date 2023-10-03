import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part 'login_screen_bloc.freezed.dart';
part 'login_screen_bloc.g.dart';

@freezed
class LoginScreenBlocState with _$LoginScreenBlocState {
  const factory LoginScreenBlocState({
    required String username,
    required String password,
    required bool acceptedTermsAndPrivacy,
  }) = _LoginScreenBlocState;
  factory LoginScreenBlocState.fromJson(Map<String, Object?> json) =>
      _$LoginScreenBlocStateFromJson(json);
}

class LoginScreenBloc extends Cubit<LoginScreenBlocState> {
  LoginScreenBloc()
      : super(const LoginScreenBlocState(
            username: "", password: "", acceptedTermsAndPrivacy: false));

  void setUsername(String u) {
    emit(state.copyWith(username: u));
  }

  void setPassword(String p) {
    emit(state.copyWith(password: p));
  }

  void setAcceptedTermsAndPrivacy(bool b) {
    emit(state.copyWith(acceptedTermsAndPrivacy: b));
  }

  void clearAll() {
    emit(state.copyWith(username: "", password: ""));
  }
}

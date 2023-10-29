import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:open_polito/logic/app_service.dart';
import 'package:open_polito/logic/auth/auth_model.dart';
import 'package:open_polito/logic/auth/auth_service.dart';
import 'package:open_polito/types.dart';

part 'login_screen_bloc.freezed.dart';

@freezed
class LoginScreenBlocState with _$LoginScreenBlocState {
  const factory LoginScreenBlocState({
    required String username,
    required String password,
    required bool acceptedTermsAndPrivacy,
    @Default(Ok(null)) Result<void, LoginErrorType> loginStatus,
  }) = _LoginScreenBlocState;
}

class LoginScreenBloc extends Cubit<LoginScreenBlocState> {
  LoginScreenBloc()
      : super(const LoginScreenBlocState(
            username: "", password: "", acceptedTermsAndPrivacy: false));

  IAuthService get _authService => appService.authService;

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

  Future<void> loginCommon(
      String username, String password, bool acceptedTermsAndPrivacy,
      {required void Function() gotoHome}) async {
    emit(state.copyWith(
      loginStatus: const Pending(),
    ));

    final loginResult = await _authService.login(
      username,
      password,
      acceptedTermsAndPrivacy: acceptedTermsAndPrivacy,
    );

    if (loginResult is Ok) {
      gotoHome();
    }

    emit(state.copyWith(
      loginStatus: loginResult,
    ));
  }

  Future<void> loginTrue(
      String username, String password, bool acceptedTermsAndPrivacy,
      {required void Function() gotoHome}) async {
    appService.setMode(AppMode.account);
    await loginCommon(username, password, acceptedTermsAndPrivacy,
        gotoHome: gotoHome);
  }

  Future<void> loginDemo({
    required void Function() gotoHome,
  }) async {
    appService.setMode(AppMode.demo);
    await loginCommon("demo", "demo", true, gotoHome: gotoHome);
  }
}

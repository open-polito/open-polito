import 'package:bloc/bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part 'auth_bloc.freezed.dart';
part 'auth_bloc.g.dart';

enum LoginStatus {
  idle,
  pending,
  error,
}

@freezed
class AuthState with _$AuthState {
  const factory AuthState({
    required LoginStatus loginStatus,
  }) = _AuthState;
  factory AuthState.fromJson(Map<String, Object?> json) =>
      _$AuthStateFromJson(json);
}

class AuthBloc extends Cubit<AuthState> {
  AuthBloc(super.initialState);
}

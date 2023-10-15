import 'package:bloc/bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:open_polito/styles/theme.dart';

part 'theme_bloc.freezed.dart';

@freezed
class ThemeBlocState with _$ThemeBlocState {
  const factory ThemeBlocState({
    required AppTheme theme,
  }) = _ThemeBlocState;
}

class ThemeBloc extends Cubit<ThemeBlocState> {
  ThemeBloc() : super(const ThemeBlocState(theme: lightTheme));

  /// Toggle between light and dark mode
  void toggleTheme() {
    // TODO : toggle
  }
}

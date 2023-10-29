import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/bloc/theme_bloc.dart';
import 'package:open_polito/ui/layout.dart';
import 'package:open_polito/ui/top_bar.dart';

class ScreenWrapper extends StatelessWidget {
  final Widget child;
  final bool isPrimaryScreen;
  final bool withPadding;
  final String screenName;

  const ScreenWrapper({
    super.key,
    required this.child,
    required this.isPrimaryScreen,
    this.withPadding = false,
    required this.screenName,
  });

  @override
  Widget build(BuildContext context) {
    return BlocProvider.value(
      value: GetIt.I.get<ThemeBloc>(),
      child: BlocBuilder<ThemeBloc, ThemeBlocState>(
        bloc: GetIt.I.get<ThemeBloc>(),
        builder: (context, state) => SafeArea(
          child: Container(
            padding:
                withPadding ? const EdgeInsets.fromLTRB(16, 64, 16, 32) : null,
            color: state.theme.background,
            child: SingleChildScrollView(
              child: Column(
                children: [
                  if (isPrimaryScreen)
                    DefaultHorizontalPadding(
                      child: TopBar(
                        screenName: screenName,
                      ),
                    ),
                  child,
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

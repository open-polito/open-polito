import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/bloc/theme_bloc.dart';
import 'package:open_polito/styles/styles.dart';

enum MyButtonType {
  primary,
  secondary,
}

class MyButton extends StatelessWidget {
  final String label;
  final MyButtonType type;
  final void Function()? onPressed;
  final bool? loading;
  final bool enabled;

  const MyButton({
    super.key,
    required this.label,
    required this.type,
    required this.onPressed,
    this.loading,
    required this.enabled,
  });

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ThemeBloc, ThemeBlocState>(
      bloc: GetIt.I.get<ThemeBloc>(),
      builder: (context, state) => TextButton(
        onPressed: enabled ? onPressed : null,
        style: ButtonStyle(
            backgroundColor: MaterialStatePropertyAll(
                type == MyButtonType.primary
                    ? state.theme.buttonPrimaryBg
                    : state.theme.buttonSecondaryBg),
            shape: MaterialStatePropertyAll(RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
                side:
                    BorderSide(color: state.theme.buttonPrimaryBg, width: 2)))),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (loading == true)
                SizedBox(
                  width: 24,
                  height: 24,
                  child: CircularProgressIndicator(
                      color: type == MyButtonType.primary
                          ? state.theme.buttonPrimaryText
                          : state.theme.buttonSecondaryText),
                ),
              if (loading == true)
                const SizedBox(
                  width: 16,
                ),
              Text(
                label,
                style: textStyle.copyWith(
                  color: type == MyButtonType.primary
                      ? state.theme.buttonPrimaryText
                      : state.theme.buttonSecondaryText,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/bloc/theme_bloc.dart';
import 'package:open_polito/styles/styles.dart';

enum MyInputType {
  text,
  email,
  password,
  number,
}

class MyTextFormField extends StatefulWidget {
  final String hint;
  final IconData icon;
  final MyInputType inputType;
  final Function(String value)? onFieldSubmitted;
  final Function(String value)? onChanged;
  final String? Function(String? value)? validator;
  final String? initialValue;
  final bool enabled;

  const MyTextFormField({
    super.key,
    required this.hint,
    required this.icon,
    required this.inputType,
    this.onFieldSubmitted,
    this.onChanged,
    this.validator,
    this.initialValue,
    this.enabled = true,
  });

  @override
  State<MyTextFormField> createState() => _MyTextFormFieldState();
}

class _MyTextFormFieldState extends State<MyTextFormField> {
  bool _showPassword = false;

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ThemeBloc, ThemeBlocState>(
      bloc: GetIt.I.get<ThemeBloc>(),
      builder: (context, state) => TextFormField(
        enabled: widget.enabled,
        initialValue: widget.initialValue,
        onFieldSubmitted: widget.onFieldSubmitted,
        onChanged: widget.onChanged,
        style: const TextStyle(
          fontSize: 14,
        ),
        obscureText:
            widget.inputType == MyInputType.password ? !_showPassword : false,
        enableSuggestions: widget.inputType != MyInputType.password,
        autocorrect: widget.inputType != MyInputType.password &&
            widget.inputType != MyInputType.email,
        validator: widget.validator,
        decoration: InputDecoration(
          prefixIcon: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Icon(widget.icon, color: state.theme.icon),
          ),
          suffixIcon: widget.inputType == MyInputType.password
              ? Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: IconButton(
                    onPressed: () {
                      setState(() {
                        _showPassword = !_showPassword;
                      });
                    },
                    icon: Icon(
                        _showPassword
                            ? Icons.visibility_rounded
                            : Icons.visibility_off_rounded,
                        color: state.theme.icon),
                  ),
                )
              : null,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: BorderSide.none,
          ),
          hoverColor: const Color.fromARGB(0, 0, 0, 0),
          hintText: widget.hint,
          hintStyle: textStyle.copyWith(
            fontWeight: FontWeight.w500,
            color: state.theme.inputHint,
            fontSize: 14,
          ),
          filled: true,
          fillColor: state.theme.elementBackground,
        ),
      ),
    );
  }
}

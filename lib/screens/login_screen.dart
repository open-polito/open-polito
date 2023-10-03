import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/bloc/auth_bloc.dart';
import 'package:open_polito/bloc/login_screen_bloc.dart';

class LoginScreen extends StatelessWidget {
  LoginScreen({super.key});

  final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider.value(value: GetIt.I.get<AuthBloc>()),
        BlocProvider.value(value: GetIt.I.get<LoginScreenBloc>()),
      ],
      child: BlocBuilder<AuthBloc, AuthState>(
        bloc: GetIt.I.get<AuthBloc>(),
        builder: (context, state) {
          return Form(
              key: _formKey,
              child: Column(
                children: [
                  TextFormField(
                    decoration: const InputDecoration(hintText: "Username"),
                    validator: (value) {
                      if (value == "") {
                        return "Username must not be empty";
                      }
                      return null;
                    },
                    onChanged: (value) {
                      context.read<LoginScreenBloc>().setUsername(value);
                    },
                  ),
                  TextFormField(
                    decoration: const InputDecoration(hintText: "Password"),
                    validator: (value) {
                      if (value == "") {
                        return "Password must not be empty";
                      }
                      return null;
                    },
                    obscureText: true,
                    onChanged: (value) {
                      context.read<LoginScreenBloc>().setPassword(value);
                    },
                  ),
                  BlocBuilder<LoginScreenBloc, LoginScreenBlocState>(
                    builder: (context, state) => Checkbox(
                      value: state.acceptedTermsAndPrivacy,
                      onChanged: (value) {
                        context
                            .read<LoginScreenBloc>()
                            .setAcceptedTermsAndPrivacy(value ?? false);
                      },
                    ),
                  ),
                  ElevatedButton(
                      onPressed: () {
                        if (_formKey.currentState?.validate() == true) {
                          final state = context.read<LoginScreenBloc>().state;
                          final authBloc = context.read<AuthBloc>();
                          authBloc.login(state.username, state.password,
                              state.acceptedTermsAndPrivacy);
                        }
                      },
                      child: const Text("Login")),
                  Text(state.toString()),
                  BlocBuilder<LoginScreenBloc, LoginScreenBlocState>(
                    builder: (context, state) => Text(state.toString()),
                  ),
                ],
              ));
        },
      ),
    );
  }
}

import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:open_polito/bloc/auth_bloc.dart';

part 'router.g.dart';

final router = GoRouter(
  routes: $appRoutes,
  initialLocation: "/",
  debugLogDiagnostics: kDebugMode,
);

@TypedShellRoute<MainShellRouteData>(routes: [
  TypedGoRoute<LoginRouteData>(path: "/login"),
  TypedGoRoute<HomeRouteData>(path: "/"),
])
class MainShellRouteData extends ShellRouteData {
  const MainShellRouteData();

  @override
  Widget builder(BuildContext context, GoRouterState state, Widget navigator) {
    return BlocConsumer<AuthBloc, AuthState>(
      builder: (context, state) => navigator,
      listener: (context, state) {
        if (state.data?.loggedIn == true) {
          const HomeRouteData().go(context);
        } else if (state.data?.loggedIn == null ||
            state.data?.loggedIn == false) {
          const LoginRouteData().go(context);
        }
      },
      bloc: GetIt.I.get<AuthBloc>()..init(),
    );
  }
}

class HomeRouteData extends GoRouteData {
  const HomeRouteData();

  @override
  Widget build(BuildContext context, GoRouterState state) {
    return Container(
      color: Colors.amber.shade700,
    );
  }
}

class LoginRouteData extends GoRouteData {
  const LoginRouteData();

  @override
  Widget build(BuildContext context, GoRouterState state) {
    return const Text("Login");
  }
}

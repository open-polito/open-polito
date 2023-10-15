import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:open_polito/bloc/auth_bloc.dart';
import 'package:open_polito/screens/home_screen.dart';
import 'package:open_polito/screens/login_screen.dart';

part 'router.g.dart';

final router = GoRouter(
  routes: $appRoutes,
  initialLocation: "/",
  debugLogDiagnostics: kDebugMode,
);

final _mainShellNavigatorKey = GlobalKey<NavigatorState>();
final _loggedInShellNavigatorKey = GlobalKey<NavigatorState>();

@TypedShellRoute<MainShellRouteData>(routes: [
  TypedShellRoute<LoggedInShellRouteData>(routes: [
    TypedGoRoute<HomeRouteData>(path: "/"),
  ]),
  TypedGoRoute<LoginRouteData>(path: "/login"),
])
class MainShellRouteData extends ShellRouteData {
  const MainShellRouteData();

  static final $navigatorKey = _mainShellNavigatorKey;

  @override
  Widget builder(BuildContext context, GoRouterState state, Widget navigator) {
    return Scaffold(
      body: BlocConsumer<AuthBloc, AuthBlocState>(
        builder: (context, state) => navigator,
        listenWhen: (previous, current) => previous != current,
        listener: (context, state) {
          if (state.data?.loggedIn == true) {
            const HomeRouteData().go(context);
          } else if (state.data?.loggedIn == null ||
              state.data?.loggedIn == false) {
            if (kDebugMode) {
              print("NOT LOGGED IN. Going to /login");
            }
            const LoginRouteData().go(context);
          }
        },
        bloc: GetIt.I.get<AuthBloc>()..init(),
      ),
    );
  }
}

class LoggedInShellRouteData extends ShellRouteData {
  const LoggedInShellRouteData();

  static final $navigatorKey = _loggedInShellNavigatorKey;

  @override
  Widget builder(BuildContext context, GoRouterState state, Widget navigator) {
    return Scaffold(
      body: navigator,
    );
  }
}

class HomeRouteData extends GoRouteData {
  const HomeRouteData();

  @override
  Widget build(BuildContext context, GoRouterState state) {
    return const HomeScreen();
  }
}

class LoginRouteData extends GoRouteData {
  const LoginRouteData();

  @override
  Widget build(BuildContext context, GoRouterState state) {
    return LoginScreen();
  }
}

import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:go_router/go_router.dart';
import 'package:open_polito/logic/auth/auth_service.dart';
import 'package:open_polito/screens/home_screen.dart';
import 'package:open_polito/screens/login_screen.dart';
import 'package:open_polito/types.dart';
import 'package:open_polito/ui/app_wrapper.dart';

part 'router.g.dart';

enum RouteType {
  unknown,
  main,
  login,
}

/// Notifies auth flow changes to the router.
class AuthNotifier extends ValueNotifier<RouteType> {
  late StreamSubscription<AuthState> _subscription;

  AuthNotifier() : super(RouteType.main) {
    _subscription = GetIt.I.get<AuthService>().stream.listen((event) {
      final loggedIn = event.loggedIn;
      value = switch (loggedIn) {
        null || true => RouteType.main,
        false => RouteType.login,
      };
      notifyListeners();
    });
  }

  @override
  void dispose() {
    _subscription.cancel();
    super.dispose();
  }
}

final router = GoRouter(
  routes: $appRoutes,
  initialLocation: "/",
  refreshListenable: AuthNotifier(),
  debugLogDiagnostics: kDebugMode,
  redirect: (context, state) {
    final loggedIn = GetIt.I.get<AuthService>().state.loggedIn;
    if (loggedIn == false) {
      // we are not logged in. Redirect to login
      return "/login";
    }
    return null;
  },
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
  MainShellRouteData();

  static final $navigatorKey = _mainShellNavigatorKey;

  @override
  Widget builder(BuildContext context, GoRouterState state, Widget navigator) {
    return Scaffold(
      body: AppWrapper(child: navigator),
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

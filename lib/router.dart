import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:open_polito/logic/app_service.dart';
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
  late final StreamSubscription<AuthServiceState> _subscription;

  AuthNotifier() : super(RouteType.main) {
    _subscription = appService.authStream.listen((event) {
      final loggedIn = event.loggedIn;
      value = switch (loggedIn) {
        Ok() => loggedIn.data == true ? RouteType.main : RouteType.login,
        Pending() => RouteType.unknown,
        Err() => RouteType.login,
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
    final loggedIn = appService.authService.state.loggedIn;
    if (loggedIn case Ok()) {
      if (!loggedIn.data) {
        // we are not logged in. Redirect to login
        return "/login";
      }
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

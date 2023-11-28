import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:go_router/go_router.dart';
import 'package:open_polito/logic/auth/auth_model.dart';
import 'package:open_polito/logic/auth/auth_service.dart';
import 'package:open_polito/models/models.dart';
import 'package:open_polito/screens/download_screen.dart';
import 'package:open_polito/screens/home_screen.dart';
import 'package:open_polito/screens/login_screen.dart';
import 'package:open_polito/screens/search_screen.dart';
import 'package:open_polito/screens/video_player_screen.dart';
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
      final authStatus = event.authStatus;
      value = switch (authStatus) {
        AuthStatus.pending => RouteType.main,
        AuthStatus.authorized => RouteType.main,
        AuthStatus.unauthorized => RouteType.login,
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
    final authState = GetIt.I.get<AuthService>().state;
    final authStatus = authState.authStatus;
    if (authStatus == AuthStatus.unauthorized) {
      // we are not logged in. Redirect to login
      if (kDebugMode) {
        print(
            "[Router] Not logged in. Will redirect to login. Auth state is: $authState");
      }
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
    TypedGoRoute<SearchRouteData>(path: "/search"),
    TypedGoRoute<VideoPlayerRouteData>(path: "/play"),
    TypedGoRoute<DownloaderRouteData>(path: "/downloads"),
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
    return const LoginScreen();
  }
}

class SearchRouteData extends GoRouteData {
  const SearchRouteData();

  @override
  Widget build(BuildContext context, GoRouterState state) {
    return const SearchScreen();
  }
}

class VideoPlayerRouteData extends GoRouteData {
  final CourseVirtualClassroom $extra;

  const VideoPlayerRouteData(this.$extra);

  @override
  Widget build(BuildContext context, GoRouterState state) {
    return VideoPlayerScreen(videoData: $extra);
  }
}

class DownloaderRouteData extends GoRouteData {
  const DownloaderRouteData();

  @override
  Widget build(BuildContext context, GoRouterState state) {
    return const DownloadScreen();
  }
}

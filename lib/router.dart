import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

part 'router.g.dart';

final router = GoRouter(
  routes: $appRoutes,
  debugLogDiagnostics: kDebugMode,
);

@TypedGoRoute<HomeRouteData>(path: "/")
class HomeRouteData extends GoRouteData {
  const HomeRouteData();

  @override
  FutureOr<String?> redirect(BuildContext context, GoRouterState state) {}

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

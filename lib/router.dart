import 'dart:async';
import 'package:device_info_plus/device_info_plus.dart';
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
    return const TempDeviceInfoWidget();
  }
}

class TempDeviceInfoWidget extends StatefulWidget {
  const TempDeviceInfoWidget({super.key});

  @override
  State<TempDeviceInfoWidget> createState() => _TempDeviceInfoWidgetState();
}

class _TempDeviceInfoWidgetState extends State<TempDeviceInfoWidget> {
  Map<String, dynamic> deviceInfo = {};

  @override
  void initState() {
    super.initState();
    getInfo();
  }

  void getInfo() async {
    final plugin = DeviceInfoPlugin();
    final info = await plugin.deviceInfo;

    setState(() {
      deviceInfo = info.data;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Device info test")),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: ListView(
            children: List.of(deviceInfo.entries
                .map((e) => Text("${e.key} : ${e.value.toString()}")))),
      ),
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

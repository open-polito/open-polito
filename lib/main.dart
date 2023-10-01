import 'package:flutter/material.dart';
import 'package:open_polito/init.dart';
import 'package:open_polito/router.dart';

void main() async {
  await configureDependencies();

  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      routerConfig: router,
    );
  }
}

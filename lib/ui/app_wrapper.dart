import 'package:flutter/material.dart';
import 'package:open_polito/ui/drawer.dart';

class AppWrapper extends StatelessWidget {
  final Widget child;

  const AppWrapper({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Stack(
        children: [
          child,
          const MyDrawer(),
        ],
      ),
    );
  }
}

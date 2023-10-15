import 'package:flutter/material.dart';

class DefaultHorizontalPadding extends StatelessWidget {
  final Widget child;

  const DefaultHorizontalPadding({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: child,
    );
  }
}

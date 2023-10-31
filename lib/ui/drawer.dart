import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/bloc/theme_bloc.dart';

class MyDrawer extends StatelessWidget {
  const MyDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider.value(
      value: GetIt.I.get<ThemeBloc>(),
      child: BlocBuilder<ThemeBloc, ThemeBlocState>(
        builder: (context, state) => Container(
          color: state.theme.background,
          child: ListView(
            children: [DrawerElement(name: "Overview", onPress: () {})],
          ),
        ),
      ),
    );
  }
}

class DrawerElement extends StatelessWidget {
  final String name;
  final void Function() onPress;

  const DrawerElement({super.key, required this.name, required this.onPress});

  @override
  Widget build(BuildContext context) {
    return Text(name);
  }
}

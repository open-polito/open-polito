import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/bloc/data_bloc.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<DataBloc, DataBlocState>(
        bloc: GetIt.I.get<DataBloc>()..getCourses(),
        builder: (context, state) {
          return Column(
            children: [
              Text(state.courses.toString()),
            ],
          );
        },
        listener: (context, state) {});
  }
}

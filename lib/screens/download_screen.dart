import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/bloc/download_bloc.dart';
import 'package:open_polito/bloc/theme_bloc.dart';
import 'package:open_polito/ui/screen_wrapper.dart';

class DownloadScreen extends StatelessWidget {
  const DownloadScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider.value(value: GetIt.I.get<ThemeBloc>()),
        BlocProvider(create: (context) => DownloadBloc()),
      ],
      child: BlocBuilder<ThemeBloc, ThemeBlocState>(
        builder: (context, state) => BlocBuilder<DownloadBloc, DownloadState>(
          builder: (context, state) => ScreenWrapper(
            isPrimaryScreen: true,
            screenName: "Downloads",
            child: const Placeholder(),
          ),
        ),
      ),
    );
  }
}

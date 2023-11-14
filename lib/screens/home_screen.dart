import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/bloc/home_screen_bloc.dart';
import 'package:open_polito/router.dart';
import 'package:open_polito/ui/home_sections/latest_classes.section.dart';
import 'package:open_polito/ui/home_sections/latest_files_section.dart';
import 'package:open_polito/ui/home_sections/live_classes_section.dart';
import 'package:open_polito/ui/layout.dart';
import 'package:open_polito/ui/screen_wrapper.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:open_polito/ui/search_field.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ScreenWrapper(
      screenName: AppLocalizations.of(context)!.screen_home,
      isPrimaryScreen: true,
      child: MultiBlocProvider(
        providers: [
          BlocProvider.value(value: GetIt.I.get<HomeScreenBloc>()..init()),
        ],
        child: BlocBuilder<HomeScreenBloc, HomeScreenBlocState>(
          builder: (context, state) => SingleChildScrollView(
            child: Column(
              children: [
                const DefaultHorizontalPadding(
                  child: SearchField(
                    redirect: true,
                  ),
                ),
                const SizedBox(height: 32),
                if (kDebugMode)
                  TextButton(
                      onPressed: () {
                        context.read<HomeScreenBloc>().resetAll(
                            gotoLogin: () =>
                                const LoginRouteData().go(context));
                      },
                      child: const Text("Debug reset")),
                if (state.liveClasses.isNotEmpty)
                  LiveClassesSection(
                    classes: state.liveClasses,
                    title: AppLocalizations.of(context)!
                        .homeScreen_section_liveClasses,
                  ),
                const SizedBox(height: 32),
                if (state.latestFiles.isNotEmpty)
                  LatestFilesSection(
                    latestFiles: state.latestFiles,
                    title: AppLocalizations.of(context)!
                        .homeScreen_section_latestFiles,
                  ),
                const SizedBox(height: 32),
                if (state.classes.isNotEmpty)
                  LatestClassesSection(
                      classes: state.classes,
                      title: AppLocalizations.of(context)!
                          .homeScreen_section_latestRecordings),
                const SizedBox(height: 32),
                Text(state.toString()),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

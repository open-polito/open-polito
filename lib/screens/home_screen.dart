import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/bloc/home_screen_bloc.dart';
import 'package:open_polito/bloc/search_screen_bloc.dart';
import 'package:open_polito/router.dart';
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
          builder: (context, state) => ListView(
            shrinkWrap: true,
            children: [
              Column(
                children: [
                  DefaultHorizontalPadding(
                    child: SearchField(
                      redirect: true,
                      onChanged: (query) {
                        context.read<SearchScreenBloc>().setQuery(query);
                      },
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
                  if (state.virtualClassrooms.isNotEmpty)
                    LiveClassesSection(
                      classes: state.virtualClassrooms,
                      title: AppLocalizations.of(context)!
                          .homeScreen_section_liveClasses,
                    ),
                  StreamBuilder(
                    stream: state.data,
                    builder: (context, snapshot) {
                      return Text(snapshot.data?.toString() ?? "");
                    },
                  )
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

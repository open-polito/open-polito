import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/api/models/courses.dart';
import 'package:open_polito/bloc/home_screen_bloc.dart';
import 'package:open_polito/ui/home_sections/home_section_base.dart';
import 'package:open_polito/ui/home_sections/live_classes_section.dart';
import 'package:open_polito/ui/layout.dart';
import 'package:open_polito/ui/screen_wrapper.dart';
import 'package:open_polito/ui/text_field.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ScreenWrapper(
      screenName: AppLocalizations.of(context)!.screen_home,
      isPrimaryScreen: true,
      child: MultiBlocProvider(
        providers: [
          BlocProvider(create: (context) => GetIt.I.get<HomeScreenBloc>()),
        ],
        child: BlocBuilder<HomeScreenBloc, HomeScreenBlocState>(
          builder: (context, state) => ListView(
            shrinkWrap: true,
            children: [
              Column(
                children: [
                  DefaultHorizontalPadding(
                    child: MyTextFormField(
                        hint: AppLocalizations.of(context)!
                            .homeScreen_label_search,
                        icon: Icons.search_rounded,
                        inputType: MyInputType.text),
                  ),
                  const SizedBox(height: 32),
                  if (kDebugMode)
                    TextButton(
                        onPressed: () {
                          context.read<HomeScreenBloc>().debugLogAll();
                        },
                        child: const Text("Debug log all")),
                  LiveClassesSection(
                    classes: [
                      VirtualClassroomLive(
                        id: 10,
                        title: "Lezione del 14/10/2023",
                        teacherId: 1,
                        meetingId: "djnjefnfenfen",
                        createdAt: "2023-10-14T09:54:00Z",
                        type: VirtualClassroomType.live,
                      ),
                    ],
                    title: AppLocalizations.of(context)!
                        .homeScreen_section_liveClasses,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

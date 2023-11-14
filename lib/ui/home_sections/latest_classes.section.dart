import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:open_polito/bloc/theme_bloc.dart';
import 'package:open_polito/logic/utils/formatters.dart';
import 'package:open_polito/models/models.dart';
import 'package:open_polito/ui/home_sections/home_section_base.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:open_polito/ui/video_item.dart';

class LatestClassesSection extends StatelessWidget {
  final List<CourseVirtualClassroom> classes;
  final String title;

  const LatestClassesSection({
    super.key,
    required this.classes,
    required this.title,
  });

  @override
  Widget build(BuildContext context) {
    final appLocalizations = AppLocalizations.of(context)!;
    final now = DateTime.now();
    return BlocBuilder<ThemeBloc, ThemeBlocState>(
      builder: (context, state) => HomeSectionBase(
        title: title,
        icon: Icons.video_collection_outlined,
        children: classes.map((e) {
          final createdAt = e.recording?.createdAt;
          return VideoItemWidget(
            bgColor: state.theme.elementBackground,
            titleColor: state.theme.cardPrimaryText,
            smallTextColor: state.theme.cardSecondaryText,
            title: e.recording?.title ?? "",
            courseName: e.courseName ?? "",
            timeString: createdAt != null
                ? localizedTimeDelta(now, createdAt, appLocalizations)
                : "",
            durationString: e.recording?.duration ?? "",
            onDownloadTap: () {}, // TODO: add behavior
            onItemTap: () {}, // TODO: add behavior
            thumbnailUrl: e.recording?.coverUrl,
          );
        }),
      ),
    );
  }
}

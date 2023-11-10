import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:open_polito/bloc/theme_bloc.dart';
import 'package:open_polito/logic/utils/file_type_utils.dart';
import 'package:open_polito/logic/utils/formatters.dart';
import 'package:open_polito/models/courses.dart';
import 'package:open_polito/ui/file_item.dart';
import 'package:open_polito/ui/home_sections/home_section_base.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class LatestFilesSection extends StatelessWidget {
  final List<CourseFileInfo> latestFiles;
  final String title;

  const LatestFilesSection({
    super.key,
    required this.latestFiles,
    required this.title,
  });

  @override
  Widget build(BuildContext context) {
    final appLocalizations = AppLocalizations.of(context)!;
    final languageCode = Localizations.localeOf(context).languageCode;
    final now = DateTime.now();
    return BlocBuilder<ThemeBloc, ThemeBlocState>(
      builder: (context, state) => HomeSectionBase(
        title: title,
        icon: Icons.folder_open_rounded,
        children: latestFiles.map((e) {
          final iconInfo = getFileIcon(e.mimeType, e.name, state.theme);
          return FileItemWidget(
            bgColor: state.theme.elementBackground,
            courseName: e.courseName,
            icon: iconInfo.icon,
            iconColor: iconInfo.color,
            name: e.name,
            nameColor: state.theme.cardPrimaryText,
            onDownloadTap: () {}, // TODO: add behavior
            onItemTap: () {}, // TODO: add behavior
            sizeString: localizedSizeFromKB(e.sizeKB.toInt(), languageCode),
            smallTextColor: state.theme.cardSecondaryText,
            timeString: localizedTimeDelta(now, e.createdAt, appLocalizations),
          );
        }),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/bloc/download_bloc.dart';
import 'package:open_polito/bloc/theme_bloc.dart';
import 'package:open_polito/logic/utils/file_type_utils.dart';
import 'package:open_polito/logic/utils/formatters.dart';
import 'package:open_polito/ui/file_item.dart';
import 'package:open_polito/ui/screen_wrapper.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class DownloadScreen extends StatelessWidget {
  const DownloadScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    return MultiBlocProvider(
      providers: [
        BlocProvider.value(value: GetIt.I.get<ThemeBloc>()),
        BlocProvider.value(value: GetIt.I.get<DownloadBloc>()),
      ],
      child: BlocBuilder<ThemeBloc, ThemeBlocState>(
        builder: (context, themeState) =>
            BlocBuilder<DownloadBloc, DownloadState>(
          builder: (context, downloadState) => ScreenWrapper(
            isPrimaryScreen: true,
            screenName: "Downloads",
            child: Column(
              children: [
                Flexible(child: Text("Downloads")),
                ...(downloadState.items.map((e) {
                  final iconInfo =
                      getFileIcon(e.mimeType, e.displayName, themeState.theme);
                  return FileItemWidget(
                      icon: iconInfo.icon,
                      iconColor: iconInfo.color,
                      bgColor: themeState.theme.elementBackground,
                      nameColor: themeState.theme.cardPrimaryText,
                      smallTextColor: themeState.theme.cardSecondaryText,
                      name: e.displayName,
                      courseName: e.courseName,
                      timeString: localizedTimeDelta(
                          now, e.createdAt, AppLocalizations.of(context)!),
                      sizeString: localizedSizeFromKB(
                          (e.totalSize ?? 0 / 1000).floor(),
                          AppLocalizations.of(context)!.localeName),
                      onItemTap: () {},
                      onDownloadTap: () {});
                }).toList()),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

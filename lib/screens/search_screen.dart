import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/bloc/search_bloc.dart';
import 'package:open_polito/bloc/theme_bloc.dart';
import 'package:open_polito/logic/utils/file_type_utils.dart';
import 'package:open_polito/logic/utils/formatters.dart';
import 'package:open_polito/models/models.dart';
import 'package:open_polito/styles/styles.dart';
import 'package:open_polito/ui/button.dart';
import 'package:open_polito/ui/file_item.dart';
import 'package:open_polito/ui/layout.dart';
import 'package:open_polito/ui/screen_wrapper.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:open_polito/ui/search_field.dart';
import 'package:open_polito/ui/video_item.dart';

// TODO: UI design
// TODO: person card design
// TODO: people: open contact details
// TODO: people: phone/email contact buttons

class SearchScreen extends StatelessWidget {
  const SearchScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final languageCode = Localizations.localeOf(context).languageCode;
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (context) => SearchBloc()),
        BlocProvider.value(value: GetIt.I.get<ThemeBloc>()),
      ],
      child: BlocBuilder<ThemeBloc, ThemeBlocState>(
        builder: (context, themeState) =>
            BlocBuilder<SearchBloc, SearchBlocState>(
          builder: (context, searchState) => ScreenWrapper(
            isPrimaryScreen: false,
            screenName: AppLocalizations.of(context)!.screen_search,
            child: Column(
              children: [
                DefaultHorizontalPadding(
                  child: Row(
                    children: [
                      Flexible(child: Text("back")),
                      Expanded(
                          child: SearchField(
                        redirect: false,
                        onChanged: (query) {
                          print("Nw query $query");
                          context.read<SearchBloc>().add(SetSearchQuery(query));
                        },
                      )),
                      Flexible(child: Text("filter")),
                    ],
                  ),
                ),
                DefaultHorizontalPadding(
                    child: Row(
                  children: [
                    MyButton(
                      label: "files",
                      type: getBtnType(
                          searchState.category, SearchCategory.files),
                      onPressed: () => context
                          .read<SearchBloc>()
                          .add(SetSearchCategory(SearchCategory.files)),
                    ),
                    MyButton(
                      label: "recordings",
                      type: getBtnType(
                          searchState.category, SearchCategory.recordings),
                      onPressed: () => context
                          .read<SearchBloc>()
                          .add(SetSearchCategory(SearchCategory.recordings)),
                    ),
                    MyButton(
                      label: "people",
                      type: getBtnType(
                          searchState.category, SearchCategory.people),
                      onPressed: () => context
                          .read<SearchBloc>()
                          .add(SetSearchCategory(SearchCategory.people)),
                    ),
                  ],
                )),
                Expanded(
                    child: DefaultHorizontalPadding(
                  child: ListView.builder(
                    shrinkWrap: true,
                    itemCount: searchState.searchResult?.items.length ?? 0,
                    itemBuilder: (context, index) {
                      final searchResult = searchState.searchResult;
                      if (searchResult == null || searchResult.items.isEmpty) {
                        return Text("no item");
                      }
                      if (searchResult case FilesSearchResult()) {
                        final file = searchResult.items[index];
                        final iconInfo = getFileIcon(file.file.mimeType,
                            file.file.name, themeState.theme);
                        return FileItemWidget(
                          icon: iconInfo.icon,
                          iconColor: iconInfo.color,
                          bgColor: themeState.theme.elementBackground,
                          nameColor: themeState.theme.cardPrimaryText,
                          smallTextColor: themeState.theme.cardSecondaryText,
                          name: file.file.name,
                          courseName: file.file.courseName,
                          timeString: localizedTimeDelta(
                              now,
                              file.file.createdAt,
                              AppLocalizations.of(context)!),
                          sizeString: localizedSizeFromKB(
                              file.file.sizeKB.toInt(), languageCode),
                          onItemTap: () => {}, // TODO: behavior
                          onDownloadTap: () => {}, // TODO: behavior
                        );
                      }
                      if (searchResult case RecordingsSearchResult()) {
                        final recording = searchResult.items[index];
                        return VideoItemWidget(
                          bgColor: themeState.theme.elementBackground,
                          titleColor: themeState.theme.cardPrimaryText,
                          smallTextColor: themeState.theme.cardSecondaryText,
                          title: recording.recording?.title ?? "",
                          courseName: recording.courseName ?? "",
                          timeString: localizedTimeDelta(
                              now,
                              recording.recording?.createdAt ?? now,
                              AppLocalizations.of(context)!),
                          durationString: recording.recording?.duration ?? "",
                          onItemTap: () {}, // TODO: behavior
                          onDownloadTap: () {}, // TODO: behavior
                        );
                      }
                      if (searchResult case PeopleSearchResult()) {
                        final person = searchResult.items[index];
                        final pictureUrl = person.picture;
                        return Row(
                          children: [
                            Container(
                                width: 64,
                                height: 64,
                                decoration: BoxDecoration(
                                    image: pictureUrl != null
                                        ? DecorationImage(
                                            image: NetworkImage(pictureUrl))
                                        : null)),
                            Column(
                              mainAxisSize: MainAxisSize.min,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Flexible(
                                    child: Text(
                                        "${person.firstName} ${person.lastName}")),
                                Flexible(
                                    child: Text(
                                  person.role ?? "",
                                  maxLines: 3,
                                  style: textStyle.copyWith(fontSize: 10),
                                )),
                              ],
                            )
                          ],
                        );
                      }
                    },
                  ),
                )),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

MyButtonType getBtnType(SearchCategory a, SearchCategory b) =>
    a == b ? MyButtonType.primary : MyButtonType.secondary;

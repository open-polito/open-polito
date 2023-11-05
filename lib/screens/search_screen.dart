import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:open_polito/bloc/search_screen_bloc.dart';
import 'package:open_polito/models/search.dart';
import 'package:open_polito/ui/button.dart';
import 'package:open_polito/ui/layout.dart';
import 'package:open_polito/ui/screen_wrapper.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:open_polito/ui/search_field.dart';

class SearchScreen extends StatelessWidget {
  const SearchScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider<SearchScreenBloc>(
      create: (context) => SearchScreenBloc(),
      child: BlocBuilder<SearchScreenBloc, SearchScreenBlocState>(
        builder: (context, state) => ScreenWrapper(
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
                        context.read<SearchScreenBloc>().setQuery(query);
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
                    type: getBtnType(state.category, SearchCategory.files),
                    onPressed: () => context
                        .read<SearchScreenBloc>()
                        .setCategory(SearchCategory.files),
                  ),
                  MyButton(
                    label: "recordings",
                    type: getBtnType(state.category, SearchCategory.recordings),
                    onPressed: () => context
                        .read<SearchScreenBloc>()
                        .setCategory(SearchCategory.recordings),
                  ),
                  MyButton(
                    label: "people",
                    type: getBtnType(state.category, SearchCategory.people),
                    onPressed: () => context
                        .read<SearchScreenBloc>()
                        .setCategory(SearchCategory.people),
                  ),
                ],
              )),
            ],
          ),
        ),
      ),
    );
  }
}

MyButtonType getBtnType(SearchCategory a, SearchCategory b) =>
    a == b ? MyButtonType.primary : MyButtonType.secondary;

import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:flutter/foundation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/data/data_repository.dart';
import 'package:open_polito/models/search.dart';

part 'search_screen_bloc.freezed.dart';

@freezed
class SearchScreenBlocState with _$SearchScreenBlocState {
  const factory SearchScreenBlocState({
    required String query,
    required SearchCategory category,
    SearchResult? searchResult,
  }) = _SearchScreenBlocState;
}

/// TODO: event debounce
class SearchScreenBloc extends Cubit<SearchScreenBlocState> {
  SearchScreenBloc()
      : super(const SearchScreenBlocState(
            query: "", category: SearchCategory.files));

  /// Set search query.
  FutureOr<void> setQuery(String query) async {
    if (query != state.query) {
      emit(state.copyWith(query: query));
      await _search(query, state.category);
    }
  }

  /// Set search category.
  FutureOr<void> setCategory(SearchCategory category) async {
    if (category != state.category) {
      emit(state.copyWith(category: category));
      await _search(state.query, category);
    }
  }

  /// Internal search function.
  FutureOr<void> _search(String query, SearchCategory category) async {
    if (query == "") {
      emit(state.copyWith(
        searchResult: null,
      ));
      return;
    }
    if (kDebugMode) {
      print("[SearchScreenBloc] New query: $query (in category $category)");
    }
    final res =
        await GetIt.I.get<DataRepository>().getSearchResults(category, query);
    emit(state.copyWith(searchResult: res));
  }
}

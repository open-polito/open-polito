import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:flutter/foundation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/bloc/transformers.dart';
import 'package:open_polito/data/data_repository/data_repository.dart';
import 'package:open_polito/models/models.dart';

part 'search_bloc.freezed.dart';

@freezed
class SearchBlocState with _$SearchBlocState {
  const factory SearchBlocState({
    required String query,
    required SearchCategory category,
    SearchResult? searchResult,
  }) = _SearchBlocState;
}

sealed class SearchBlocEvent {}

class SetSearchQuery extends SearchBlocEvent {
  final String query;
  SetSearchQuery(this.query);
}

class SetSearchCategory extends SearchBlocEvent {
  final SearchCategory category;
  SetSearchCategory(this.category);
}

/// Starts a new search
class DoSearch extends SearchBlocEvent {}

class SearchBloc extends Bloc<SearchBlocEvent, SearchBlocState> {
  SearchBloc()
      : super(
            const SearchBlocState(query: "", category: SearchCategory.files)) {
    on<SetSearchQuery>((event, emit) {
      if (event.query != state.query) {
        emit(state.copyWith(query: event.query));
        add(DoSearch());
      }
    });
    on<SetSearchCategory>((event, emit) {
      if (event.category != state.category) {
        emit(state.copyWith(category: event.category));
        add(DoSearch());
      }
    });
    on<DoSearch>(
      (event, emit) async {
        emit(await _search(state.query, state.category));
      },
      transformer: debounce(const Duration(milliseconds: 500)),
    );
  }

  /// Internal search function.
  FutureOr<SearchBlocState> _search(
      String query, SearchCategory category) async {
    if (query == "") {
      return state.copyWith(
        searchResult: null,
      );
    }
    if (kDebugMode) {
      print("[SearchScreenBloc] New query: $query (in category $category)");
    }
    final res = await GetIt.I.get<DataRepository>().getSearchResults(query,
        category: category,
        sortOrder: SortOrder.desc,
        sortBy: SortBy.createdAt);
    return state.copyWith(searchResult: res);
  }
}

import 'package:bloc/bloc.dart';
import 'package:dio/dio.dart';
import 'package:get_it/get_it.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:open_polito/data/data_repository.dart';
import 'package:polito_api/polito_api.dart';

part 'home_screen_bloc.freezed.dart';
part 'home_screen_bloc.g.dart';

@freezed
class HomeScreenBlocState with _$HomeScreenBlocState {
  const factory HomeScreenBlocState({
    int? a,
  }) = _HomeScreenBlocState;
  factory HomeScreenBlocState.fromJson(Map<String, Object?> json) =>
      _$HomeScreenBlocStateFromJson(json);
}

class HomeScreenBloc extends Cubit<HomeScreenBlocState> {
  HomeScreenBloc() : super(HomeScreenBlocState());

  IDataRepository get _dataRepository => GetIt.I.get<IDataRepository>();

  Future<void> populate() async {}

  Future<void> debugLogAll() async {
    final api = GetIt.I.get<PolitoApi>();

    final courses = await api.getCoursesApi().getCourses();
    print(courses.toString());
  }
}

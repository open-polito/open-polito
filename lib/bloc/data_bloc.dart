import 'package:bloc/bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:get_it/get_it.dart';
import 'package:polito_api/polito_api.dart';

part 'data_bloc.freezed.dart';

@freezed
class DataBlocState with _$DataBlocState {
  const factory DataBlocState({
    GetCourses200Response? courses,
  }) = _DataBlocState;
}

class DataBloc extends Cubit<DataBlocState> {
  DataBloc() : super(const DataBlocState());

  PolitoApi get _api => GetIt.I.get<PolitoApi>();

  void getCourses() {
    _api
        .getCoursesApi()
        .getCourses()
        .then((value) => emit(state.copyWith(courses: value.data)));
  }
}

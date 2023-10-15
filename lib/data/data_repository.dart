import 'dart:async';

import 'package:dio/dio.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/models/courses.dart';
import 'package:polito_api/polito_api.dart' as api;

part 'data_repository.freezed.dart';
part 'data_repository.g.dart';

@freezed
class DataWrapper<T> with _$DataWrapper<T> {
  const factory DataWrapper({
    required T? data,
    required Response<T>? res,
    required int sent,
    required int sentTotal,
    required int recv,
    required int recvTotal,
  }) = _DataWrapper;
}

typedef WrapperStream<T> = Stream<DataWrapper<T>>;
// typedef ApiFunction<T> = Future<Response<T>> Function({
//   ProgressCallback? onSendProgress,
//   ProgressCallback? onReceiveProgress,
// });

abstract class IDataRepository {}

@freezed
class DataRepositoryState with _$DataRepositoryState {
  const factory DataRepositoryState({
    required Map<String, CourseData> coursesById,
  }) = _DataRepositoryState;
  factory DataRepositoryState.fromJson(Map<String, Object?> json) =>
      _$DataRepositoryStateFromJson(json);
}

class DataRepository extends IDataRepository {
  api.PolitoApi get _api => GetIt.I.get<api.PolitoApi>();

  // final StreamController<DataRepositoryState> _controller

  DataRepository();

  Future<T?> _w<T>(Future<Response<T>> future) async {
    try {
      final res = await future;
      return res.data;
    } catch (e) {
      return null;
    }
  }

  // WrapperStream<T> _req<T>(ApiFunction<T> func) {
  //   StreamController<DataWrapper<T>> controller = StreamController();

  //   DataWrapper<T> wrapper = DataWrapper<T>(
  //       data: null, res: null, sent: 0, sentTotal: 1, recv: 0, recvTotal: 1);
  //   controller.add(wrapper);

  //   try {
  //     func(
  //       onSendProgress: (count, total) {
  //         controller.add(wrapper.copyWith(sent: count, sentTotal: total));
  //       },
  //       onReceiveProgress: (count, total) {
  //         controller.add(wrapper.copyWith(recv: count, recvTotal: total));
  //       },
  //     ).then((value) {
  //       controller.add(wrapper.copyWith(res: value, data: value.));
  //       controller.close();
  //     });
  //   } catch (e) {
  //     //TODO
  //   } finally {
  //     controller.close();
  //   }

  //   return controller.stream;
  // }
}

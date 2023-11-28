import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:bloc/bloc.dart';

part 'download_bloc.freezed.dart';

abstract class DownloadEvent {}

@freezed
class DownloadState with _$DownloadState {
  const factory DownloadState() = _DownloadState;
}

class DownloadBloc extends Bloc<DownloadEvent, DownloadState> {
  DownloadBloc() : super(DownloadState());
}

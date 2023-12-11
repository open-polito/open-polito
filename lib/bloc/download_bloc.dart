import 'dart:async';

import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:bloc/bloc.dart';
import 'package:open_polito/db/database.dart';
import 'package:open_polito/db/schema/schema.dart';
import 'package:open_polito/logic/downloader/downloader.dart';

part 'download_bloc.freezed.dart';

abstract class DownloadEvent {
  const DownloadEvent();
}

class StartDownloader extends DownloadEvent {}

class StopDownloader extends DownloadEvent {}

class EnqueueItem extends DownloadEvent {
  final String itemId;
  final DbDownloadItemType type;
  final int courseId;
  final String courseName;

  const EnqueueItem({
    required this.itemId,
    required this.type,
    required this.courseId,
    required this.courseName,
  });
}

class _SetRunning extends DownloadEvent {
  final bool value;
  const _SetRunning(this.value);
}

class _SetItems extends DownloadEvent {
  final List<DbDownloadItem> value;
  const _SetItems(this.value);
}

@freezed
class DownloadState with _$DownloadState {
  const factory DownloadState({
    required bool running,
    required List<DbDownloadItem> items,
  }) = _DownloadState;
}

class DownloadBloc extends Bloc<DownloadEvent, DownloadState> {
  final DownloadService downloadService;

  StreamSubscription<bool>? runningSub;
  StreamSubscription<List<DbDownloadItem>>? itemsSub;

  DownloadBloc(this.downloadService)
      : super(const DownloadState(running: false, items: [])) {
    runningSub = downloadService.runningSubject.listen((value) {
      add(_SetRunning(value));
    });
    itemsSub = downloadService.itemsSubject.listen((value) {
      add(_SetItems(value));
    });

    downloadService.run();

    on<_SetRunning>((event, emit) async {
      emit(state.copyWith(running: event.value));
    });
    on<_SetItems>((event, emit) async {
      emit(state.copyWith(items: event.value));
    });

    on<StartDownloader>((event, emit) async {
      add(const _SetRunning(true));
      downloadService.run();
    });
    on<StopDownloader>((event, emit) async {
      add(const _SetRunning(false));
      await downloadService.pause();
    });
    on<EnqueueItem>((event, emit) async {
      await downloadService.addFileToQueue(
        itemId: event.itemId,
        courseId: event.courseId,
        courseName: event.courseName,
      );
    });
  }

  @override
  Future<void> close() {
    runningSub?.cancel();
    itemsSub?.cancel();
    return super.close();
  }
}

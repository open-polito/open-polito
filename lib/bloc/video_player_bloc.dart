import 'package:bloc/bloc.dart';
import 'package:flutter/foundation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:media_kit/media_kit.dart';
import 'package:media_kit_video/media_kit_video.dart';
import 'package:open_polito/models/models.dart';

part 'video_player_bloc.freezed.dart';

abstract class VideoPlayerEvent {
  const VideoPlayerEvent();
}

class InitPlayer extends VideoPlayerEvent {}

@freezed
class VideoPlayerState with _$VideoPlayerState {
  const factory VideoPlayerState({
    required CourseVirtualClassroom videoData,
    required VideoController controller,
  }) = _VideoPlayerState;
}

class VideoPlayerBloc extends Bloc<VideoPlayerEvent, VideoPlayerState> {
  VideoPlayerBloc({
    required CourseVirtualClassroom videoData,
    required VideoController controller,
  }) : super(VideoPlayerState(videoData: videoData, controller: controller)) {
    on<InitPlayer>((event, emit) async {
      final recording = state.videoData.recording;
      if (recording == null) {
        if (kDebugMode) {
          print("[VideoPlayer] Video recording is null: $recording");
        }
        return;
      }
      final videoUrl = recording.videoUrl;
      if (videoUrl != null) {
        if (kDebugMode) {
          print("[VideoPlayer] Opening and playing video at: $videoUrl");
        }
        await controller.player.open(Media(videoUrl), play: true);
      } else {
        if (kDebugMode) {
          print("[VideoPlayer] videoUrl is null: $videoUrl");
        }
      }
    });
  }

  @override
  Future<void> close() async {
    await state.controller.player.dispose();
    return super.close();
  }
}

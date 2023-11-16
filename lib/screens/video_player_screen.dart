import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:go_router/go_router.dart';
import 'package:media_kit/media_kit.dart';
import 'package:media_kit_video/media_kit_video.dart';
import 'package:open_polito/bloc/theme_bloc.dart';
import 'package:open_polito/bloc/video_player_bloc.dart';
import 'package:open_polito/models/models.dart';
import 'package:open_polito/ui/screen_wrapper.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

// TODO: UI design
// TODO: all features

class VideoPlayerScreen extends StatefulWidget {
  final CourseVirtualClassroom videoData;
  const VideoPlayerScreen({super.key, required this.videoData});

  @override
  State<VideoPlayerScreen> createState() => _VideoPlayerScreenState();
}

class _VideoPlayerScreenState extends State<VideoPlayerScreen> {
  late final player = Player();
  late final controller = VideoController(Player());
  late final GlobalKey<VideoState> key = GlobalKey<VideoState>();

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        if (key.currentState?.isFullscreen() == true) {
          if (kDebugMode) {
            print(
                "[VideoPlayer] Will not go back, since fullscreen is enabled");
          }
          key.currentState?.exitFullscreen();
          return false;
        }
        return true;
      },
      child: MultiBlocProvider(
        providers: [
          BlocProvider<VideoPlayerBloc>(
              create: (context) => VideoPlayerBloc(
                  videoData: widget.videoData, controller: controller)
                ..add(InitPlayer())),
          BlocProvider.value(value: GetIt.I.get<ThemeBloc>()),
        ],
        child: ScreenWrapper(
          isPrimaryScreen: false,
          screenName: AppLocalizations.of(context)!.screen_videoPlayer,
          child: BlocBuilder<VideoPlayerBloc, VideoPlayerState>(
            builder: (context, state) => Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextButton(
                    onPressed: () {
                      context.pop();
                    },
                    child: const Text("Back")),
                Flexible(
                  fit: FlexFit.loose,
                  child: Video(
                    key: key,
                    controller: controller,
                  ),
                ),
                Expanded(
                    flex: 2,
                    child: Column(
                      children: [
                        Flexible(
                          child: Text(state.videoData.recording?.title ?? ""),
                        ),
                        Flexible(
                          child: Text(state.videoData.courseName ?? ""),
                        ),
                      ],
                    )),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

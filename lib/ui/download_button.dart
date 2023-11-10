import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';

typedef DownloadButtonInfo = ({
  Color color,
  Widget icon,
});

enum DownloadButtonState {
  download,
  downloaded,
  downloading,
}

class DownloadButton extends StatelessWidget {
  static const iconSize = 24.0;

  final DownloadButtonState state;
  final void Function() onTap;

  const DownloadButton({
    super.key,
    required this.state,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final DownloadButtonInfo info = switch (state) {
      DownloadButtonState.download => (
          color: Colors.lightBlue.shade100,
          icon: Icon(
            TablerIcons.download,
            color: Colors.lightBlue.shade700,
            size: iconSize,
          )
        ),
      DownloadButtonState.downloaded => (
          color: Colors.lightGreen.shade100,
          icon: Icon(
            TablerIcons.check,
            color: Colors.lightGreen.shade700,
            size: iconSize,
          )
        ),
      DownloadButtonState.downloading => (
          color: Colors.lightBlue.shade100,
          icon: Center(
            child: SizedBox(
              width: iconSize - 4,
              height: iconSize - 4,
              child: CircularProgressIndicator(
                color: Colors.lightBlue.shade700,
                strokeWidth: 3.0,
              ),
            ),
          )
        ),
    };
    return GestureDetector(
      onTap: onTap,
      child: SizedBox(
        width: 32,
        height: 32,
        child: DecoratedBox(
          decoration: BoxDecoration(
            color: info.color,
            borderRadius: const BorderRadius.only(topLeft: Radius.circular(8)),
          ),
          child: info.icon,
        ),
      ),
    );
  }
}

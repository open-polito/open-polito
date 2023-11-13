import 'package:flutter/material.dart';
import 'package:open_polito/styles/styles.dart';
import 'package:open_polito/ui/download_button.dart';

class FileItemWidget extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final Color bgColor, nameColor, smallTextColor;

  final String name;
  final String courseName;

  /// Human-readable file time
  final String timeString;

  /// Human-readable file size
  final String sizeString;

  /// Callback when the item is tapped in any area except
  /// for the download button.
  final void Function() onItemTap;

  /// Callback when the item's download button is tapped.
  final void Function() onDownloadTap;

  const FileItemWidget({
    super.key,
    required this.icon,
    required this.iconColor,
    required this.bgColor,
    required this.nameColor,
    required this.smallTextColor,
    required this.name,
    required this.courseName,
    required this.timeString,
    required this.sizeString,
    required this.onItemTap,
    required this.onDownloadTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: defaultHorizontalPadding),
      child: Stack(alignment: Alignment.bottomRight, children: [
        GestureDetector(
          onTap: onItemTap,
          child: SizedBox(
            width: 300,
            child: DecoratedBox(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8),
                color: bgColor,
              ),
              child: Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          icon,
                          color: iconColor,
                          size: 32,
                        ),
                        const SizedBox(width: 4),
                        Flexible(
                          child: Text(
                            name,
                            style: textStyle.copyWith(
                              color: nameColor,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              overflow: TextOverflow.ellipsis,
                              height: 1,
                            ),
                            maxLines: 2,
                          ),
                        )
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      "$courseName\n$timeString · $sizeString",
                      style: textStyle.copyWith(
                        color: smallTextColor,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 2,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
        DownloadButton(
          state: DownloadButtonState.download, // TODO: implement behavior
          onTap: onDownloadTap,
        ),
      ]),
    );
  }
}

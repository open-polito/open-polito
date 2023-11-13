import 'package:flutter/material.dart';
import 'package:open_polito/styles/styles.dart';
import 'package:open_polito/ui/download_button.dart';

class VideoItemWidget extends StatelessWidget {
  final Color bgColor, titleColor, smallTextColor;
  final String title, courseName, timeString, durationString;
  final void Function() onItemTap, onDownloadTap;

  final String thumbnailUrl;

  const VideoItemWidget({
    super.key,
    required this.bgColor,
    required this.titleColor,
    required this.smallTextColor,
    required this.title,
    required this.courseName,
    required this.timeString,
    required this.durationString,
    required this.onItemTap,
    required this.onDownloadTap,
    required this.thumbnailUrl,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: defaultHorizontalPadding),
      child: Stack(
        alignment: Alignment.bottomRight,
        children: [
          GestureDetector(
            onTap: onItemTap,
            child: Container(
              width: 300,
              height: 80,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8),
                color: bgColor,
              ),
              child: Row(
                children: [
                  Flexible(
                    flex: 2,
                    child: Stack(
                      alignment: Alignment.bottomRight,
                      children: [
                        Container(
                          height: 80,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(8),
                            image: thumbnailUrl.isNotEmpty
                                ? DecorationImage(
                                    image: NetworkImage(thumbnailUrl),
                                    fit: BoxFit.cover,
                                  )
                                : null,
                            color: thumbnailUrl.isEmpty ? Colors.black : null,
                          ),
                          child: thumbnailUrl.isEmpty
                              ? Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Center(
                                    child: Text(
                                      "NO IMAGE",
                                      style: textStyle.copyWith(
                                        color: Colors.red,
                                      ),
                                    ),
                                  ),
                                )
                              : null,
                        ),
                        Container(
                          decoration: const BoxDecoration(
                            color: Colors.black,
                            borderRadius: BorderRadius.only(
                              topLeft: Radius.circular(8.0),
                              bottomRight: Radius.circular(8.0),
                            ),
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(4.0),
                            child: Text(
                              durationString,
                              style: textStyle.copyWith(
                                color: Colors.white,
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Flexible(
                    flex: 3,
                    child: Padding(
                      padding: const EdgeInsets.only(top: 16, right: 8),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Flexible(
                            child: Text(
                              title,
                              style: textStyle.copyWith(
                                color: titleColor,
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                overflow: TextOverflow.ellipsis,
                                height: 1,
                              ),
                              maxLines: 2,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Flexible(
                            child: Text(
                              "$courseName\n$timeString",
                              style: textStyle.copyWith(
                                color: smallTextColor,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                overflow: TextOverflow.ellipsis,
                              ),
                              maxLines: 2,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          DownloadButton(
            state: DownloadButtonState.download, // TODO: implement behavior
            onTap: onDownloadTap,
          )
        ],
      ),
    );
  }
}

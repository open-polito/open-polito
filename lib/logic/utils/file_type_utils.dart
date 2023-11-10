import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:open_polito/styles/theme.dart';

typedef IconInfo = ({
  IconData icon,
  Color color,
});

enum FileType {
  plaintext,
  video,
  pdf,
  compressedArchive,
  other,
}

const Map<String, FileType> mimeTypeMap = {
  "application/pdf": FileType.pdf,
  "application/zip": FileType.compressedArchive,
  "application/x-zip-compressed": FileType.compressedArchive,
  "text/plain": FileType.plaintext,
  "video/mp4": FileType.video,
};

final Map<RegExp, FileType> mimeTypeRegexpMap = {
  RegExp(r"^video\/.+"): FileType.video,
};

const Map<String, FileType> extMap = {
  "pdf": FileType.pdf,
  "zip": FileType.compressedArchive,
  "txt": FileType.plaintext,
  "mp4": FileType.video,
};

/// Returns an icon and its color for [fileType].
IconInfo iconFromFileType(FileType fileType, AppTheme currentTheme) {
  return switch (fileType) {
    FileType.plaintext => (
        icon: TablerIcons.file_text,
        color: currentTheme.cardSecondaryText
      ),
    FileType.video => (icon: TablerIcons.movie, color: Colors.blue.shade400),
    FileType.pdf => (
        icon: TablerIcons.file_type_pdf,
        color: Colors.red.shade400
      ),
    FileType.compressedArchive => (
        icon: TablerIcons.file_zip,
        color: Colors.purple.shade400
      ),
    FileType.other => (
        icon: TablerIcons.file,
        color: currentTheme.cardSecondaryText
      ),
  };
}

/// Returns an icon and its color given [mimeType] and, optionally, [fileName].
IconInfo getFileIcon(
    String? mimeType, String? fileName, AppTheme currentTheme) {
  final fileType = getFileType(mimeType, fileName);
  return iconFromFileType(fileType, currentTheme);
}

/// Returns the file type given [mimeType] and [fileName].
///
/// Tries to infer the file type from [mimeType], and then from [fileName]
/// as a fallback.
FileType getFileType(String? mimeType, String? fileName) {
  // 1. Get type from map.
  final typeFromMap = mimeTypeMap[mimeType];
  if (typeFromMap != null) {
    return typeFromMap;
  }

  // 2. Try from regexp map
  final typeFromRegexpMap = mimeTypeRegexpMap[mimeType];
  if (typeFromRegexpMap != null) {
    return typeFromRegexpMap;
  }

  // 3. Try again from filename.
  final extension = fileName?.split(".").last;
  if (extension != null) {
    final typeFromExtMap = extMap[extension];
    if (typeFromExtMap != null) {
      return typeFromExtMap;
    }
  }
  return FileType.other;
}

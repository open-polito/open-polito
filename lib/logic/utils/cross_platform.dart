import 'dart:async';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:open_polito/types.dart';

/// Get the platform type
PlatformType getPlatform() {
  if (kIsWeb) {
    return PlatformType.web;
  }
  if (Platform.isAndroid) {
    return PlatformType.android;
  }
  if (Platform.isIOS) {
    return PlatformType.iOS;
  }
  if (Platform.isLinux) {
    return PlatformType.linux;
  }
  if (Platform.isMacOS) {
    return PlatformType.macOS;
  }
  if (Platform.isWindows) {
    return PlatformType.windows;
  }
  return PlatformType.unknown;
}

/// Returns a value of type [T] based on the platform.
T? crossPlatformValue<T>({
  required T? Function() android,
  required T? Function() iOS,
  required T? Function() linux,
  required T? Function() macOS,
  required T? Function() windows,
  required T? Function() web,
  T? Function()? unknown,
}) {
  return switch (getPlatform()) {
    PlatformType.android => android(),
    PlatformType.iOS => iOS(),
    PlatformType.linux => linux(),
    PlatformType.macOS => macOS(),
    PlatformType.windows => windows(),
    PlatformType.web => web(),
    PlatformType.unknown => unknown != null ? unknown() : null,
  };
}

/// Returns a `FutureOr<T>` based on the platform.
FutureOr<T?> crossPlatformFutureOr<T>({
  required FutureOr<T?> Function() android,
  required FutureOr<T?> Function() iOS,
  required FutureOr<T?> Function() linux,
  required FutureOr<T?> Function() macOS,
  required FutureOr<T?> Function() windows,
  required FutureOr<T?> Function() web,
  FutureOr<T?> Function()? unknown,
}) {
  return switch (getPlatform()) {
    PlatformType.android => android(),
    PlatformType.iOS => iOS(),
    PlatformType.linux => linux(),
    PlatformType.macOS => macOS(),
    PlatformType.windows => windows(),
    PlatformType.web => web(),
    PlatformType.unknown => unknown != null ? unknown() : null,
  };
}

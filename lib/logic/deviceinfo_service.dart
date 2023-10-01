import 'dart:collection';
import 'dart:io';

import 'package:device_info_plus/device_info_plus.dart';
import 'package:flutter/foundation.dart';

enum DeviceInfoKey {
  manufacturer,
  model,
  name,
  platform,
  version,
}

abstract class IDeviceInfoService {
  static Future<String> getItem(DeviceInfoKey key) async => "";
}

class DeviceInfoService implements IDeviceInfoService {
  static final DeviceInfoPlugin plugin = DeviceInfoPlugin();

  // TODO: iOS info
  // TODO: MacOS info
  // TODO: Windows info

  static final HashMap<DeviceInfoKey, InfoFinder> map = HashMap.of({
    DeviceInfoKey.manufacturer: InfoFinder(
      android: (a) => a.manufacturer,
      ios: (a) => "Apple",
      linux: (a) => null,
      macos: (a) => null,
      windows: (a) => null,
      web: (a) => null,
      other: (a) => null,
    ),
    DeviceInfoKey.model: InfoFinder(
      android: (a) => a.model,
      ios: (a) => a.model,
      linux: (a) => null,
      macos: (a) => null,
      windows: (a) => null,
      web: (a) => null,
      other: (a) => null,
    ),
    DeviceInfoKey.name: InfoFinder(
      android: (a) => null,
      ios: (a) => null,
      linux: (a) => a.prettyName,
      macos: (a) => null,
      windows: (a) => null,
      web: (a) => null,
      other: (a) => null,
    ),
    DeviceInfoKey.platform: InfoFinder(
      android: (a) => "Android",
      ios: (a) => "iOS",
      linux: (a) => a.id,
      macos: (a) => "MacOS",
      windows: (a) => "Windows",
      web: (a) => "Web",
      other: (a) => "unknown",
    ),
    DeviceInfoKey.version: InfoFinder(
      android: (a) => a.version.release,
      ios: (a) => null,
      linux: (a) => a.versionId,
      macos: (a) => null,
      windows: (a) => null,
      web: (a) => null,
      other: (a) => null,
    ),
  });

  static Future<String?> getItem(DeviceInfoKey key) async {
    final finder = map[key];
    if (finder == null) {
      return "";
    }

    try {
      final plugin = DeviceInfoPlugin();

      if (kIsWeb) {
        return finder.web(await plugin.webBrowserInfo);
      }
      if (Platform.isAndroid) {
        return finder.android(await plugin.androidInfo);
      }
      if (Platform.isIOS) {
        return finder.ios(await plugin.iosInfo);
      }
      if (Platform.isLinux) {
        return finder.linux(await plugin.linuxInfo);
      }
      if (Platform.isMacOS) {
        return finder.macos(await plugin.macOsInfo);
      }
      if (Platform.isWindows) {
        return finder.windows(await plugin.windowsInfo);
      }

      // Return generic data
      return finder.other(null);
    } catch (e) {}

    return "";
  }
}

typedef PlatformGet<T> = String? Function(T a);

/// Describes how to get a device info item on each platform
class InfoFinder {
  final PlatformGet<AndroidDeviceInfo> android;
  final PlatformGet<IosDeviceInfo> ios;
  final PlatformGet<LinuxDeviceInfo> linux;
  final PlatformGet<MacOsDeviceInfo> macos;
  final PlatformGet<WindowsDeviceInfo> windows;
  final PlatformGet<WebBrowserInfo> web;
  final PlatformGet other;

  const InfoFinder({
    required this.android,
    required this.ios,
    required this.linux,
    required this.macos,
    required this.windows,
    required this.web,
    required this.other,
  });
}

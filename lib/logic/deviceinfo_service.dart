import 'dart:collection';
import 'dart:io';

import 'package:device_info_plus/device_info_plus.dart';

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

  // TODO: Android info
  // TODO: iOS info
  // TODO: Linux info
  // TODO: MacOS info
  // TODO: Windows info

  static final HashMap<DeviceInfoKey, InfoFinder> map = HashMap.of({
    DeviceInfoKey.manufacturer: InfoFinder(
      android: (a) => a.manufacturer,
      ios: (a) => "Apple",
      linux: (a) => "",
      macos: (a) => "",
      windows: (a) => "",
    ),
    DeviceInfoKey.model: InfoFinder(
      android: (a) => a.model,
      ios: (a) => a.model,
      linux: (a) => "",
      macos: (a) => a.model,
      windows: (a) => "",
    ),
    DeviceInfoKey.name: InfoFinder(
      android: (a) => "",
      ios: (a) => "",
      linux: (a) => "",
      macos: (a) => "",
      windows: (a) => "",
    ),
    DeviceInfoKey.platform: InfoFinder(
      android: (a) => "Android",
      ios: (a) => "iOS",
      linux: (a) => "Linux",
      macos: (a) => "MacOS",
      windows: (a) => "Windows",
    ),
    DeviceInfoKey.version: InfoFinder(
      android: (a) => a.version.release,
      ios: (a) => a.systemVersion,
      linux: (a) => a.version ?? "",
      macos: (a) => "",
      windows: (a) => a.displayVersion,
    ),
  });

  static Future<String> getItem(DeviceInfoKey key) async {
    final finder = map[key];
    if (finder == null) {
      return "";
    }

    try {
      final plugin = DeviceInfoPlugin();

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
    } catch (e) {}

    return "";
  }
}

typedef PlatformGet<T> = String Function(T a);

/// Describes how to get a device info item on each platform
class InfoFinder {
  final PlatformGet<AndroidDeviceInfo> android;
  final PlatformGet<IosDeviceInfo> ios;
  final PlatformGet<WindowsDeviceInfo> windows;
  final PlatformGet<MacOsDeviceInfo> macos;
  final PlatformGet<LinuxDeviceInfo> linux;

  const InfoFinder({
    required this.android,
    required this.ios,
    required this.windows,
    required this.macos,
    required this.linux,
  });
}

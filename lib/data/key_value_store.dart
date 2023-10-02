import 'dart:async';

import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:rxdart/rxdart.dart';
import 'package:shared_preferences/shared_preferences.dart';

part 'key_value_store.freezed.dart';
part 'key_value_store.g.dart';

abstract class StoreKey {
  static const acceptedTermsAndPrivacy = "acceptedTermsAndPrivacy";
  static const loggedIn = "loggedIn";
}

@freezed
class KeyValueStoreData with _$KeyValueStoreData {
  const factory KeyValueStoreData({
    required bool? loggedIn,
    required bool? acceptedTermsAndPrivacy,
  }) = _KeyValueStoreData;
  factory KeyValueStoreData.fromJson(Map<String, Object?> json) =>
      _$KeyValueStoreDataFromJson(json);
}

class KeyValueStore {
  final SharedPreferences _prefs;

  final BehaviorSubject<KeyValueStoreData> _controller;

  Stream<KeyValueStoreData> get data => _controller.stream;

  KeyValueStore._(this._prefs, this._controller);

  static Future<KeyValueStore> init() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();

    // hydrate data
    KeyValueStoreData data = await _hydrate(prefs);
    final streamController = BehaviorSubject<KeyValueStoreData>.seeded(data);

    return KeyValueStore._(prefs, streamController);
  }

  static Future<KeyValueStoreData> _hydrate(SharedPreferences prefs) async {
    return KeyValueStoreData(
      loggedIn: prefs.getBool(StoreKey.loggedIn),
      acceptedTermsAndPrivacy: prefs.getBool(StoreKey.acceptedTermsAndPrivacy),
    );
  }

  void setAcceptedTermsAndPrivacy(bool v) {
    _prefs.setBool(StoreKey.acceptedTermsAndPrivacy, v);
    _controller.add(_controller.value.copyWith(acceptedTermsAndPrivacy: v));
  }

  void setLoggedIn(bool v) {
    _prefs.setBool(StoreKey.loggedIn, v);
    _controller.add(_controller.value.copyWith(loggedIn: v));
  }
}

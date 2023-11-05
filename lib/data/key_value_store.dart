import 'dart:async';

import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:open_polito/types.dart';
import 'package:rxdart/rxdart.dart';
import 'package:shared_preferences/shared_preferences.dart';

part 'key_value_store.freezed.dart';

enum StoreKey {
  acceptedTermsAndPrivacy("acceptedTermsAndPrivacy"),
  loggedIn("loggedIn");

  final String key;

  const StoreKey(this.key);
}

@freezed
class KvStoreState with _$KvStoreState {
  const factory KvStoreState({
    required bool? loggedIn,
    required bool? acceptedTermsAndPrivacy,
  }) = _KvStoreState;
}

class KvStore {
  final SharedPreferences _prefs;

  final BehaviorSubject<Result<KvStoreState, void>> _controller;

  Stream<Result<KvStoreState, void>> get stream => _controller.stream;

  Result<KvStoreState, void> get state => _controller.value;

  KvStore._(this._prefs, this._controller);

  static Future<KvStore> init() async {
    final streamController =
        BehaviorSubject<Result<KvStoreState, void>>.seeded(const Pending());
    final SharedPreferences prefs = await SharedPreferences.getInstance();

    // hydrate data
    KvStoreState data = await _hydrate(prefs);
    streamController.add(Ok(data));

    return KvStore._(prefs, streamController);
  }

  static Future<KvStoreState> _hydrate(SharedPreferences prefs) async {
    return KvStoreState(
      loggedIn: prefs.getBool(StoreKey.loggedIn.key),
      acceptedTermsAndPrivacy:
          prefs.getBool(StoreKey.acceptedTermsAndPrivacy.key),
    );
  }

  void _update(KvStoreState Function(KvStoreState prev) updater) {
    final current = state;
    final Result<KvStoreState, void> newState = switch (current) {
      Ok() => Ok(updater(current.data)),
      Pending() => current,
      Err() => current,
    };
    _controller.add(newState);
  }

  Future<void> setAcceptedTermsAndPrivacy(bool v) async {
    await _prefs.setBool(StoreKey.acceptedTermsAndPrivacy.key, v);
    _update((prev) => prev.copyWith(
          acceptedTermsAndPrivacy: v,
        ));
  }

  Future<void> setLoggedIn(bool v) async {
    await _prefs.setBool(StoreKey.loggedIn.key, v);
    _update((prev) => prev.copyWith(loggedIn: v));
  }

  Future<void> clear() async {
    await _prefs.clear();
    _update((prev) =>
        const KvStoreState(loggedIn: null, acceptedTermsAndPrivacy: null));
  }
}

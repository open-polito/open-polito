import 'package:flutter_secure_storage/flutter_secure_storage.dart';

enum StoreKey {
  /// API token
  token,

  /// Client ID used by PoliTo API
  politoClientID,
}

abstract class ISecureStore {
  Future<String?> read(StoreKey key);
  Future<void> write(StoreKey key, String? value);
  Future<void> delete(StoreKey key);

  String keyStr(StoreKey key) => _keyStr(key);
}

class SecureStore implements ISecureStore {
  final FlutterSecureStorage _storage;

  const SecureStore._(this._storage);

  static SecureStore init() {
    const s = FlutterSecureStorage();
    const instance = SecureStore._(s);
    return instance;
  }

  @override
  Future<String?> read(StoreKey key) async {
    final k = keyStr(key);
    return await _storage.read(key: k);
  }

  @override
  Future<void> write(StoreKey key, String? value) async {
    final k = keyStr(key);
    await _storage.write(key: k, value: value);
  }

  @override
  Future<void> delete(StoreKey key) async {
    final k = keyStr(key);
    await _storage.delete(key: k);
  }

  @override
  String keyStr(StoreKey key) => _keyStr(key);
}

String _keyStr(StoreKey key) {
  switch (key) {
    case StoreKey.token:
      return "token";
    case StoreKey.politoClientID:
      return "politoClientID";
  }
}

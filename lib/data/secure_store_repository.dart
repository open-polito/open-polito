import 'package:flutter_secure_storage/flutter_secure_storage.dart';

abstract class ISecureStoreRepository {
  Future<String?> secureRead(SecureStoreKey key);
  Future<void> secureWrite(SecureStoreKey key, String? value);
  Future<void> secureDelete(SecureStoreKey key);

  Future<void> saveLoginInfo({
    required String clientID,
    required String token,
  });

  Future<void> clear();
}

enum SecureStoreKey {
  /// API token
  politoApiToken("politoApiToken"),

  /// Client ID used by PoliTo API
  politoClientId("politoClientId");

  final String key;

  const SecureStoreKey(this.key);
}

class SecureStoreRepository implements ISecureStoreRepository {
  final FlutterSecureStorage _secureStore;

  const SecureStoreRepository._(this._secureStore);

  static Future<SecureStoreRepository> init() async {
    const secureStore = FlutterSecureStorage();
    return const SecureStoreRepository._(secureStore);
  }

  @override
  Future<String?> secureRead(SecureStoreKey key) async {
    return await _secureStore.read(key: key.key);
  }

  @override
  Future<void> secureWrite(SecureStoreKey key, String? value) async {
    await _secureStore.write(key: key.key, value: value);
  }

  @override
  Future<void> secureDelete(SecureStoreKey key) async {
    await _secureStore.delete(key: key.key);
  }

  @override
  Future<void> saveLoginInfo(
      {required String clientID, required String token}) async {
    await secureWrite(SecureStoreKey.politoClientId, clientID);
    await secureWrite(SecureStoreKey.politoApiToken, token);
  }

  @override
  Future<void> clear() async {
    await _secureStore.deleteAll();
  }
}

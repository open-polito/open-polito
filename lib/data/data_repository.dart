import 'package:flutter_secure_storage/flutter_secure_storage.dart';

abstract class IDataRepository {
  Future<String?> secureRead(SecureStoreKey key);
  Future<void> secureWrite(SecureStoreKey key, String? value);
  Future<void> secureDelete(SecureStoreKey key);

  Future<void> saveLoginInfo({
    required String clientID,
    required String token,
  });

  Future<void> clearLoginInfo();
}

enum SecureStoreKey {
  /// API token
  politoApiToken,

  /// Client ID used by PoliTo API
  politoClientId,
}

/// Returns the key string to access a secure store value
String _secureKeyStr(SecureStoreKey key) {
  switch (key) {
    case SecureStoreKey.politoApiToken:
      return "politoApiToken";
    case SecureStoreKey.politoClientId:
      return "politoClientId";
  }
}

class DataRepository implements IDataRepository {
  final FlutterSecureStorage _secureStore;

  const DataRepository._(this._secureStore);

  static Future<DataRepository> init() async {
    const secureStore = FlutterSecureStorage();
    return const DataRepository._(secureStore);
  }

  @override
  Future<String?> secureRead(SecureStoreKey key) async {
    return await _secureStore.read(key: _secureKeyStr(key));
  }

  @override
  Future<void> secureWrite(SecureStoreKey key, String? value) async {
    await _secureStore.write(key: _secureKeyStr(key), value: value);
  }

  @override
  Future<void> secureDelete(SecureStoreKey key) async {
    await _secureStore.delete(key: _secureKeyStr(key));
  }

  @override
  Future<void> saveLoginInfo(
      {required String clientID, required String token}) async {
    await secureWrite(SecureStoreKey.politoClientId, clientID);
    await secureWrite(SecureStoreKey.politoApiToken, token);
  }

  @override
  Future<void> clearLoginInfo() async {
    await secureDelete(SecureStoreKey.politoClientId);
    await secureDelete(SecureStoreKey.politoApiToken);
  }
}

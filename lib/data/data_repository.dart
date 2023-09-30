import 'package:open_polito/data/secure_store.dart';

abstract class IDataRepository {
  Future<void> saveLoginInfo({
    required String clientID,
    required String token,
  });

  Future<void> clearLoginInfo();
}

class DataRepository implements IDataRepository {
  final ISecureStore _secureStore;

  const DataRepository(this._secureStore);

  @override
  Future<void> saveLoginInfo(
      {required String clientID, required String token}) async {
    await _secureStore.write(StoreKey.politoClientID, clientID);
    await _secureStore.write(StoreKey.token, token);
  }

  @override
  Future<void> clearLoginInfo() async {
    await _secureStore.delete(StoreKey.politoClientID);
    await _secureStore.delete(StoreKey.token);
  }
}

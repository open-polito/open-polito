import 'package:open_polito/data/secure_store.dart';
import 'package:shared_preferences/shared_preferences.dart';

abstract class IDataRepository {
  Future<void> saveLoginInfo({
    required String clientID,
    required String token,
  });

  Future<void> clearLoginInfo();

  Future<void> setAcceptedTermsAndPrivacy(bool accepted);
}

enum SharedPrefsKey { acceptedTermsAndPrivacy }

String sharedPrefsKeyToStr(SharedPrefsKey k) {
  switch (k) {
    case SharedPrefsKey.acceptedTermsAndPrivacy:
      return "acceptedTermsAndPrivacy";
  }
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

  @override
  Future<void> setAcceptedTermsAndPrivacy(bool accepted) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final key = sharedPrefsKeyToStr(SharedPrefsKey.acceptedTermsAndPrivacy);
    await prefs.setBool(key, accepted);
  }
}

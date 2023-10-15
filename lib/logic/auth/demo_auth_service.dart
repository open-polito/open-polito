import 'package:open_polito/logic/auth/auth_service.dart';

class DemoAuthService extends IAuthService {
  Future<T> _delayed<T>(T obj) async {
    return await Future.delayed(const Duration(milliseconds: 300), () => obj);
  }

  @override
  Future<LoginResult> login(String username, String password,
      {required bool acceptedTermsAndPrivacy}) {
    return _delayed(const LoginResult(err: null));
  }

  @override
  Future<void> logout() {
    return Future.value();
  }

  @override
  Future<void> onTokenInvalid() {
    return Future.value();
  }

  @override
  Future<void> onNewToken(String newToken) {
    return Future.value();
  }
}

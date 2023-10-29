import 'package:open_polito/logic/auth/auth_model.dart';
import 'package:open_polito/logic/auth/auth_service.dart';
import 'package:open_polito/types.dart';
import 'package:rxdart/rxdart.dart';

class DemoAuthService extends IAuthService {
  Future<T> _delayed<T>(T obj) async {
    return await Future.delayed(const Duration(milliseconds: 300), () => obj);
  }

  final _stream = BehaviorSubject.seeded(
      const AuthServiceState(loggedIn: Ok(true), token: Ok("abcdef")));

  @override
  Stream<AuthServiceState> get stream => _stream.stream;

  @override
  AuthServiceState get state => _stream.value;

  @override
  Future<Result<void, LoginErrorType>> login(String username, String password,
      {required bool acceptedTermsAndPrivacy}) {
    _stream.last
        .then((value) => _stream.add(value.copyWith(loggedIn: Ok(true))));
    return _delayed(const Ok(null));
  }

  @override
  Future<void> logout() {
    return Future.value();
  }

  @override
  Future<void> invalidate() {
    return Future.value();
  }
}

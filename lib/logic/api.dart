import 'package:dio/dio.dart';
import 'package:open_polito/logic/auth/auth_service.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';

Dio setupDio({
  required OnTokenInvalidCallback onTokenInvalid,
}) {
  final dio = Dio();

  dio.interceptors.add(InterceptorsWrapper(onResponse: (e, handler) async {
    handler.next(e);
  }, onError: (e, handler) async {
    if (e.response?.statusCode == 401) {
      // Unauthorized. Invalidate login
      await onTokenInvalid();
    }
    handler.next(e);
  }));

  dio.interceptors.add(
    PrettyDioLogger(
      requestHeader: false,
      requestBody: false,
      responseHeader: false,
      responseBody: false,
      request: true,
    ),
  );

  return dio;
}

extension DioExt on Dio {
  void setToken(String? t) {
    options.headers["Authorization"] = "Bearer $t";
  }
}

import 'package:dio/dio.dart';
import 'package:open_polito/logic/auth/auth_service.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';

class DioWrapper {
  final Dio dio;

  OnTokenInvalidCallback? onTokenInvalid;

  DioWrapper(this.dio) {
    dio.interceptors.add(InterceptorsWrapper(
      onResponse: (e, handler) async {
        handler.next(e);
      },
      onError: (e, handler) async {
        if (e.response?.statusCode == 401) {
          // Unauthorized. Invalidate login
          if (onTokenInvalid != null) {
            await onTokenInvalid!();
          }
        }
        handler.next(e);
      },
      onRequest: (options, handler) {
        // print(options.headers);
        handler.next(options);
      },
    ));

    dio.interceptors.add(
      PrettyDioLogger(
        requestHeader: true,
        requestBody: false,
        responseHeader: false,
        responseBody: true,
        request: true,
      ),
    );
  }

  /// Updates token
  setToken(String t) {
    dio.setToken(t);
  }
}

extension DioExt on Dio {
  void setToken(String? t) {
    options.headers["Authorization"] = "Bearer $t";
  }
}

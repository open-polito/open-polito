import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/logic/auth/auth_service.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';
import 'package:retrofit/retrofit.dart';

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
        responseHeader: true,
        responseBody: true,
        request: true,
      ),
    );
  }

  /// Update token
  setToken(String t) {
    dio.setToken(t);
  }
}

extension DioExt on Dio {
  void setToken(String? t) {
    options.headers["Authorization"] = "Bearer $t";
  }
}

/// Wrapper for API requests.
/// This function is guaranteed to return null if there is an error.
Future<T?> req<T>(Future<HttpResponse<T>> Function() futureFn) async {
  try {
    final last = GetIt.I.get<AuthService>().state;
    final token = last.token;
    if (token != null) {
      return (await futureFn()).data;
    }
    return null;
  } catch (e, s) {
    if (kDebugMode) {
      print("An error happened! $e. Trace: $s");
    }
    return null;
  }
}

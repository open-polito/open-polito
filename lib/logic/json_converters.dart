import 'package:json_annotation/json_annotation.dart';

const myJsonSerializable = JsonSerializable(converters: [
  SafeIntConverter(),
  SafeNullableIntConverter(),
  // ExactTypeConverter(),
]);

int? _baseIntFromJson(dynamic json) {
  if (json is int) {
    return json;
  }
  if (json is String) {
    final num = int.tryParse(json, radix: 10);
    return num;
  }
  return null;
}

class SafeIntConverter implements JsonConverter<int, dynamic> {
  const SafeIntConverter();

  @override
  int fromJson(dynamic json) {
    final i = _baseIntFromJson(json);
    if (i != null) {
      return i;
    }
    throw Exception();
  }

  @override
  int toJson(int object) => object;
}

class SafeNullableIntConverter implements JsonConverter<int?, dynamic> {
  const SafeNullableIntConverter();

  @override
  int? fromJson(json) => _baseIntFromJson(json);

  @override
  toJson(int? object) => object;
}

class ExactTypeConverter<T> implements JsonConverter<T?, dynamic> {
  const ExactTypeConverter();

  @override
  T? fromJson(json) {
    if (json is T) {
      return json;
    }
    return null;
  }

  @override
  toJson(T? object) {
    return T;
  }
}

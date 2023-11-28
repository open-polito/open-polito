import 'dart:async';

sealed class Result<T, E> {}

class Pending<T, E> implements Result<T, E> {
  final T? partial;
  final double? progress;
  const Pending([this.partial, this.progress]);
}

class Ok<T, E> implements Result<T, E> {
  final T data;
  const Ok(this.data);
}

class Err<T, E> implements Result<T, E> {
  final E err;
  const Err(this.err);
}

/// A function that describes how to process a previous value [prev]
/// to return a new value.
///
/// Useful in streams to emit new values by updating a previous one,
/// for example using `copyWith`.
typedef Updater<T> = FutureOr<T> Function(T prev);

/// Represent the platform as enum to allow pattern matching
enum PlatformType {
  android,
  iOS,
  linux,
  macOS,
  windows,
  web,
  unknown,
}

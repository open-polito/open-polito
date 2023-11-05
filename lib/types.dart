import 'dart:async';

sealed class Result<T, E> {}

class Pending<T, E> implements Result<T, E> {
  final double? progress;
  const Pending([this.progress]);
}

class Ok<T, E> implements Result<T, E> {
  final T data;
  const Ok(this.data);
}

class Err<T, E> implements Result<T, E> {
  final E err;
  const Err(this.err);
}

typedef Updater<T> = FutureOr<T> Function(T prev);

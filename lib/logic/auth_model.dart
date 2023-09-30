enum LoginValidationError {
  invalidUsername,
  invalidPassword,
}

enum LoginStatus {
  idle,
  pending,
  ok,
  error,
}

enum LoginErrorType {
  general,
  validation,
  userTypeNotSupported,
}

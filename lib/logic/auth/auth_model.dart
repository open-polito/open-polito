enum LoginValidationError {
  invalidUsername,
  invalidPassword,
}

/// Login operation status. Used to show the login operation status
/// in the login screen.
enum LoginStatus {
  idle,
  pending,
  ok,
  error,
}

/// App-wide authentication status
enum AuthStatus {
  /// Not known yet
  pending,

  /// Can make authorized API calls
  authorized,

  /// Need to login
  unauthorized,
}

enum LoginErrorType {
  general,
  validation,
  userTypeNotSupported,
  termsAndPrivacyNotAccepted,
}

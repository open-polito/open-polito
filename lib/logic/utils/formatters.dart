import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:intl/intl.dart';

/// Returns a localized string representing the duration in the past.
///
/// Example: `16 hours ago`.
String localizedDurationPast(
    Duration duration, AppLocalizations appLocalizations) {
  if (duration.inMinutes == 0) {
    return appLocalizations.durationPast_seconds(duration.inSeconds);
  }
  if (duration.inHours == 0) {
    return appLocalizations.durationPast_minutes(duration.inMinutes);
  }
  if (duration.inDays == 0) {
    return appLocalizations.durationPast_hours(duration.inHours);
  }
  return appLocalizations.durationPast_days(duration.inDays);
}

/// Returns a localized string representing the difference duration between
/// two dates.
///
/// Example: `16 hours ago`.
String localizedTimeDelta(
    DateTime a, DateTime b, AppLocalizations appLocalizations) {
  final duration = a.difference(b);
  return localizedDurationPast(duration, appLocalizations);
}

/// Returns a localized string representing the size of a file.
///
/// Parameters:
/// - [sizeKB] is the size in KB
/// - [languageCode] is the language code used to correctly localize the String
String localizedSizeFromKB(int sizeKB, String languageCode) {
  // TODO: More efficient implementation. This is intentionally naive for now.

  const oneK = 1000;
  const oneM = oneK * oneK;

  if (sizeKB < oneK) {
    return "${localizedDecimal(sizeKB, languageCode)} KB";
  }
  if (sizeKB < oneM) {
    return "${localizedDecimal(sizeKB / oneK, languageCode)} MB";
  }
  return "${localizedDecimal(sizeKB / oneM, languageCode)} GB";
}

/// Returns a localized string representation of a number.
String localizedDecimal(num n, String languageCode, [int decimalDigits = 2]) {
  return NumberFormat.decimalPatternDigits(
          locale: languageCode, decimalDigits: decimalDigits)
      .format(n);
}

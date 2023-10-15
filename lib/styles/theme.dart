import 'package:flutter/widgets.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:open_polito/styles/colors.dart';

part 'theme.freezed.dart';

@freezed
class AppTheme with _$AppTheme {
  const factory AppTheme({
    required Color background,
    required Color elementBackground,
    required Color icon,
    required Color inputHint,
    required Color link,
    required Color buttonPrimaryBg,
    required Color buttonPrimaryText,
    required Color buttonSecondaryBg,
    required Color buttonSecondaryText,
    required Color label,
    required Color primaryScreenTitle,
    required Color homeScreenSectionTitle,
  }) = _AppTheme;
}

const lightTheme = AppTheme(
  background: AppColors.gray100,
  elementBackground: AppColors.gray50,
  icon: AppColors.gray600,
  inputHint: AppColors.gray500,
  link: AppColors.accent300,
  buttonPrimaryBg: AppColors.accent300,
  buttonPrimaryText: AppColors.gray50,
  buttonSecondaryBg: AppColors.gray100,
  buttonSecondaryText: AppColors.gray700,
  label: AppColors.gray700,
  primaryScreenTitle: AppColors.gray900,
  homeScreenSectionTitle: AppColors.gray600,
);

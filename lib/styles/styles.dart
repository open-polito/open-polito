import 'package:flutter/material.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:open_polito/styles/colors.dart';

part 'styles.freezed.dart';

@freezed
class AppStyles with _$AppStyles {
  const factory AppStyles({
    required int horizontalMargin,
    required int verticalMargin,
  }) = _AppStyles;
}

const textStyle = TextStyle(fontFamily: "DM Sans");

final linkTextStyle = textStyle.copyWith(
  color: AppColors.accent300,
  decoration: TextDecoration.underline,
  decorationThickness: 2.0,
);

const defaultHorizontalPadding = 16.0;

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:open_polito/bloc/theme_bloc.dart';
import 'package:open_polito/styles/colors.dart';
import 'package:open_polito/styles/styles.dart';

class BadgeIconButton extends StatelessWidget {
  final int? badgeCount;
  final IconData icon;
  final void Function() onTap;

  const BadgeIconButton({
    super.key,
    this.badgeCount,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ThemeBloc, ThemeBlocState>(
      builder: (context, state) => Stack(
        alignment: Alignment.topRight,
        children: [
          Padding(
            padding: const EdgeInsets.all(4.0),
            child: SizedBox(
              width: 40,
              height: 40,
              child: DecoratedBox(
                decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: state.theme.elementBackground),
                child: IconButton(
                    onPressed: onTap,
                    icon: Icon(
                      icon,
                      color: state.theme.icon,
                    )),
              ),
            ),
          ),
          if (badgeCount != null && badgeCount! > 0)
            DecoratedBox(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                color: Colors.red,
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  vertical: 2.0,
                  horizontal: 4.0,
                ),
                child: Text(
                  badgeCount! > 99 ? "99+" : badgeCount.toString(),
                  style: textStyle.copyWith(
                    color: AppColors.gray50,
                    fontSize: 10,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            )
        ],
      ),
    );
  }
}

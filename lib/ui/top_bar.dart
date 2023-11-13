import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:open_polito/bloc/theme_bloc.dart';
import 'package:open_polito/styles/styles.dart';
import 'package:open_polito/ui/badge_icon_button.dart';

class TopBar extends StatelessWidget {
  final String screenName;
  final int? downloadBadgeCount, notificationsBadgeCount;

  const TopBar({
    super.key,
    required this.screenName,
    this.downloadBadgeCount,
    this.notificationsBadgeCount,
  });

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ThemeBloc, ThemeBlocState>(
      builder: (context, state) => Padding(
        padding: const EdgeInsets.fromLTRB(0, 16, 0, 32),
        child: Row(
          children: [
            IconButton(
              onPressed: () {},
              icon: const Icon(Icons.menu_rounded),
              iconSize: 32,
            ),
            const SizedBox(
              width: 8,
            ),
            Text(
              screenName,
              style: textStyle.copyWith(
                fontSize: 32,
                color: state.theme.primaryScreenTitle,
                fontWeight: FontWeight.w500,
              ),
              overflow: TextOverflow.ellipsis,
            ),
            Expanded(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  BadgeIconButton(
                    icon: Icons.download_rounded,
                    badgeCount: downloadBadgeCount,
                  ),
                  BadgeIconButton(
                    icon: Icons.notifications_rounded,
                    badgeCount: downloadBadgeCount,
                  )
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

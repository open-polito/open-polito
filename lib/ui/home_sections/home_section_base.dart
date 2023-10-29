import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:open_polito/bloc/theme_bloc.dart';
import 'package:open_polito/styles/styles.dart';
import 'package:open_polito/ui/layout.dart';

class HomeSectionBase extends StatelessWidget {
  final String title;
  final IconData icon;
  final List<Widget> children;

  const HomeSectionBase({
    super.key,
    required this.title,
    required this.icon,
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ThemeBloc, ThemeBlocState>(
      builder: (context, state) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          DefaultHorizontalPadding(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(
                  icon,
                  color: state.theme.homeScreenSectionTitle,
                  size: 20,
                ),
                const SizedBox(width: 4),
                Text(
                  title,
                  style: textStyle.copyWith(
                    color: state.theme.homeScreenSectionTitle,
                    fontWeight: FontWeight.w500,
                    fontSize: 16,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                const SizedBox(
                  width: defaultHorizontalPadding,
                ),
                ...children,
              ],
            ),
          ),
        ],
      ),
    );
  }
}

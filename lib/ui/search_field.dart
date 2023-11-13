import 'package:flutter/material.dart';
import 'package:open_polito/router.dart';
import 'package:open_polito/ui/text_field.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class SearchField extends StatelessWidget {
  /// If `true`, redirects to search screen when tapped.
  final bool redirect;

  final void Function(String query)? onChanged;

  const SearchField({super.key, required this.redirect, this.onChanged});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      child: MyTextFormField(
        hint: AppLocalizations.of(context)!.homeScreen_label_search,
        icon: Icons.search_rounded,
        inputType: MyInputType.text,
        enabled: redirect ? false : true,
        onChanged: onChanged,
      ),
      onTap: () {
        if (redirect) {
          const SearchRouteData().push(context);
        }
      },
    );
  }
}

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:open_polito/bloc/auth_bloc.dart';
import 'package:open_polito/bloc/login_bloc.dart';
import 'package:open_polito/bloc/theme_bloc.dart';
import 'package:open_polito/config.dart';
import 'package:open_polito/logic/auth/auth_model.dart';
import 'package:open_polito/router.dart';
import 'package:open_polito/styles/colors.dart';
import 'package:open_polito/styles/styles.dart';
import 'package:open_polito/types.dart';
import 'package:open_polito/ui/button.dart';
import 'package:open_polito/ui/screen_wrapper.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:open_polito/ui/text_field.dart';
import 'package:url_launcher/url_launcher.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  static final _formKey = GlobalKey<FormState>();

  static const maxWidth = 400.0;

  @override
  Widget build(BuildContext context) {
    return ScreenWrapper(
      isPrimaryScreen: false,
      screenName: AppLocalizations.of(context)!.screen_login,
      withPadding: true,
      child: MultiBlocProvider(
        providers: [
          BlocProvider.value(value: GetIt.I.get<ThemeBloc>()),
          BlocProvider.value(value: GetIt.I.get<AuthBloc>()),
          BlocProvider(create: (context) => LoginScreenBloc()),
        ],
        child: BlocBuilder<ThemeBloc, ThemeBlocState>(
          builder: (context, themeState) =>
              BlocBuilder<LoginScreenBloc, LoginBlocState>(
            builder: (context, loginState) =>
                BlocBuilder<AuthBloc, AuthBlocState>(
              builder: (context, authState) => Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: maxWidth),
                  child: ListView(
                    shrinkWrap: true,
                    children: [
                      const SizedBox(
                        height: 64,
                        width: 128,
                        child: DecoratedBox(
                          decoration: BoxDecoration(color: AppColors.accent300),
                        ),
                      ),
                      Column(
                        children: [
                          Text(
                            "Log in",
                            style: textStyle.copyWith(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: themeState.theme.label,
                            ),
                          ),
                          const SizedBox(
                            height: 24,
                          ),
                          // if (authState.loginErrorType != null)
                          Text(
                            (() {
                              final appLocalizations =
                                  AppLocalizations.of(context)!;
                              final status = loginState.loginStatus;
                              if (status case Err()) {
                                switch (status.err) {
                                  case LoginErrorType.general:
                                    return appLocalizations
                                        .loginScreen_label_loginError;
                                  case LoginErrorType
                                        .termsAndPrivacyNotAccepted:
                                    return appLocalizations
                                        .loginScreen_label_termsAndPrivacyNotAccepted;
                                  case LoginErrorType.userTypeNotSupported:
                                    return appLocalizations
                                        .loginScreen_label_studentOnly;
                                  default:
                                    return "";
                                }
                              }
                              return "";
                            })(),
                            style: textStyle.copyWith(
                              fontSize: 16,
                              fontWeight: FontWeight.normal,
                              color: Colors.red,
                            ),
                          ),
                          const SizedBox(
                            height: 24,
                          ),
                          Form(
                            key: _formKey,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: [
                                MyTextFormField(
                                  initialValue: loginState.username,
                                  hint: AppLocalizations.of(context)!
                                      .loginScreen_input_username,
                                  icon: Icons.account_circle_rounded,
                                  inputType: MyInputType.email,
                                  onChanged: (value) {
                                    context
                                        .read<LoginScreenBloc>()
                                        .setUsername(value);
                                  },
                                  validator: (value) {
                                    if (value == "") {
                                      return AppLocalizations.of(context)!
                                          .loginScreen_label_usernameValidation;
                                    }
                                    return null;
                                  },
                                ),
                                const SizedBox(
                                  height: 32,
                                ),
                                MyTextFormField(
                                  initialValue: loginState.password,
                                  hint: AppLocalizations.of(context)!
                                      .loginScreen_input_password,
                                  icon: Icons.lock_rounded,
                                  inputType: MyInputType.password,
                                  onChanged: (value) {
                                    context
                                        .read<LoginScreenBloc>()
                                        .setPassword(value);
                                  },
                                  validator: (value) {
                                    if (value == "") {
                                      return AppLocalizations.of(context)!
                                          .loginScreen_label_passwordValidation;
                                    }
                                    return null;
                                  },
                                ),
                                const SizedBox(
                                  height: 24,
                                ),
                                Row(
                                  children: [
                                    Checkbox(
                                      activeColor:
                                          themeState.theme.buttonPrimaryBg,
                                      value: loginState.acceptedTermsAndPrivacy,
                                      onChanged: (value) {
                                        context
                                            .read<LoginScreenBloc>()
                                            .setAcceptedTermsAndPrivacy(
                                                value ?? false);
                                      },
                                    ),
                                    Expanded(
                                      child: RichText(
                                        text: TextSpan(
                                          style: textStyle.copyWith(
                                            fontSize: 12,
                                            fontWeight: FontWeight.normal,
                                            color: themeState.theme.label,
                                          ),
                                          children: [
                                            TextSpan(
                                                text: AppLocalizations.of(
                                                        context)!
                                                    .loginScreen_label_consent_part1),
                                            TextSpan(
                                              text: AppLocalizations.of(
                                                      context)!
                                                  .loginScreen_label_consent_tos,
                                              style: linkTextStyle.copyWith(
                                                  fontWeight: FontWeight.bold),
                                              recognizer: TapGestureRecognizer()
                                                ..onTap = () {
                                                  launchUrl(cfg.tosUrl);
                                                },
                                            ),
                                            TextSpan(
                                                text: AppLocalizations.of(
                                                        context)!
                                                    .loginScreen_label_consent_part2),
                                            TextSpan(
                                              text: AppLocalizations.of(
                                                      context)!
                                                  .loginScreen_label_consent_privacy,
                                              style: linkTextStyle.copyWith(
                                                  fontWeight: FontWeight.bold),
                                              recognizer: TapGestureRecognizer()
                                                ..onTap = () {
                                                  launchUrl(
                                                      cfg.privacyPolicyUrl);
                                                },
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(
                                  height: 24,
                                ),
                                MyButton(
                                  label: AppLocalizations.of(context)!
                                      .loginScreen_action_login,
                                  type: MyButtonType.primary,
                                  loading: loginState.loginStatus is Pending,
                                  enabled: loginState.loginStatus is! Pending,
                                  onPressed: () {
                                    if (_formKey.currentState?.validate() ==
                                        true) {
                                      final loginBloc =
                                          context.read<LoginScreenBloc>();
                                      loginBloc.loginTrue(
                                        loginState.username,
                                        loginState.password,
                                        loginState.acceptedTermsAndPrivacy,
                                        gotoHome: () =>
                                            const HomeRouteData().go(context),
                                      );
                                    }
                                  },
                                ),
                                const SizedBox(
                                  height: 24,
                                ),
                                const Divider(),
                                const SizedBox(
                                  height: 24,
                                ),
                                Text(
                                  AppLocalizations.of(context)!
                                      .loginScreen_label_demo,
                                  style: textStyle.copyWith(
                                      fontSize: 12,
                                      color: themeState.theme.label),
                                ),
                                const SizedBox(height: 8),
                                MyButton(
                                  label: AppLocalizations.of(context)!
                                      .loginScreen_action_demo,
                                  type: MyButtonType.secondary,
                                  enabled: loginState.loginStatus is! Pending,
                                  onPressed: () {
                                    context.read<LoginScreenBloc>().loginDemo(
                                        gotoHome: () =>
                                            const HomeRouteData().go(context));
                                  },
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

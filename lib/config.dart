class Cfg {
  final Uri tosUrl, privacyPolicyUrl;

  const Cfg({
    required this.tosUrl,
    required this.privacyPolicyUrl,
  });
}

final cfg = Cfg(
  // TODO: real ToS url
  tosUrl: Uri.parse("https://example.com"),
  // TODO: real Privacy Policy url
  privacyPolicyUrl: Uri.parse("https://example.com"),
);

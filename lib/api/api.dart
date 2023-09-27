import 'package:openapi_generator_annotations/openapi_generator_annotations.dart';

@Openapi(
  additionalProperties: AdditionalProperties(pubName: 'polito_api'),
  inputSpecFile: 'api/openapi.yaml',
  generatorName: Generator.dio,
  outputDirectory: 'packages/polito_api',
)
class PolitoApi {}

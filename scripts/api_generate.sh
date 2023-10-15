#/usr/bin/sh
openapi-generator-cli generate -i api/openapi.yaml -g dart-dio -o packages/polito_api --additional-properties=pubName=polito_api
cd packages/polito_api
flutter pub get
dart run build_runner build --delete-conflicting-outputs
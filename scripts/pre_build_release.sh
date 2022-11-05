#!/bin/bash

# Extract files from secrets
echo $RELEASE_KEYSTORE | base64 -d > $GITHUB_WORKSPACE/key-store.jks
sed -i "s/APP_SECRET/$APP_SECRET/g" android/app/src/main/assets/appcenter-config.json
echo $GOOGLE_SERVICES_JSON_RELEASE | base64 -d > $GITHUB_WORKSPACE/android/app/google-services.json
#!/bin/bash

# Extract files from secrets
echo $DEV_KEYSTORE | base64 -d > $GITHUB_WORKSPACE/dev-key-store.jks
sed -i "s/APP_SECRET/$APP_SECRET/g" packages/mobile/android/app/src/main/assets/appcenter-config.json
echo $GOOGLE_SERVICES_JSON | base64 -d > $GITHUB_WORKSPACE/packages/mobile/android/app/google-services.json
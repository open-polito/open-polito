#!/bin/bash

# Remove files obtained from secrets
shred -vz $GITHUB_WORKSPACE/dev-key-store.jks $GITHUB_WORKSPACE/android/app/google-services.json ; rm -f $GITHUB_WORKSPACE/dev-key-store.jks $GITHUB_WORKSPACE/android/app/google-services.json
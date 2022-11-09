#!/bin/bash

# Remove files obtained from secrets
shred -vz $GITHUB_WORKSPACE/key-store.jks $GITHUB_WORKSPACE/android/app/google-services.json ; rm -f $GITHUB_WORKSPACE/key-store.jks $GITHUB_WORKSPACE/android/app/google-services.json
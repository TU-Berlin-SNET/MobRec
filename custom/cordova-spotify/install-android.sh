#!/usr/bin/env bash

SDK_INSTALL_PATH="plugins/cordova-spotify/src/android/spotify-sdk"
SDK_DOWNLOAD_PATH="https://github.com/spotify/android-sdk/archive/v0.6.3-appremote_v1.1.0-auth.tar.gz"

if [ ! -d "$SDK_INSTALL_PATH" ]; then
    mkdir -p "$SDK_INSTALL_PATH"
    curl -LsS $SDK_DOWNLOAD_PATH | tar -xz -C "$SDK_INSTALL_PATH" --strip 1
else
    echo "Skipping streaming SDK download since it's alredy there."
fi

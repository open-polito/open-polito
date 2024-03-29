<h1 align="center">Open PoliTo</h1>
<p align="center">Unofficial, open-source mobile app for Politecnico di Torino students.</p>

<div align="center">

[![Try online](https://img.shields.io/badge/Web_app-lightblue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGNsYXNzPSJpY29uIGljb24tdGFibGVyIGljb24tdGFibGVyLXdvcmxkIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBzdHJva2U9Im5vbmUiIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI5IiAvPgogIDxsaW5lIHgxPSIzLjYiIHkxPSI5IiB4Mj0iMjAuNCIgeTI9IjkiIC8+CiAgPGxpbmUgeDE9IjMuNiIgeTE9IjE1IiB4Mj0iMjAuNCIgeTI9IjE1IiAvPgogIDxwYXRoIGQ9Ik0xMS41IDNhMTcgMTcgMCAwIDAgMCAxOCIgLz4KICA8cGF0aCBkPSJNMTIuNSAzYTE3IDE3IDAgMCAxIDAgMTgiIC8+Cjwvc3ZnPgoKCg==&logoColor=black)](https://open-polito.github.io)
[![Android app](https://img.shields.io/badge/Android_app-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://github.com/open-polito/open-polito/releases/latest)

<!-- [![iOS app](https://img.shields.io/badge/iOS_app-black?style=for-the-badge&logo=apple&logoColor=white)](#download-url) -->

</div>

<div align="center">

[![Windows app](https://img.shields.io/badge/Windows_app-0078D6?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/open-polito/open-polito/releases/latest)
[![macOS app](https://img.shields.io/badge/macOS_app-black?style=for-the-badge&logo=apple&logoColor=white)](https://github.com/open-polito/open-polito/releases/latest)
[![Linux deb](https://img.shields.io/badge/Linux_.deb-A81D33?style=for-the-badge&logo=debian)](https://github.com/open-polito/open-polito/releases/latest)
[![Linux AppImage](https://img.shields.io/badge/Linux_AppImage-FCC624?style=for-the-badge&logo=linux&logoColor=black)](https://github.com/open-polito/open-polito/releases/latest)

<!-- [![Linux Flathub Download](https://img.shields.io/static/v1?label=DOWNLOAD&message=Linux%20Flathub&color=4A86CF&style=for-the-badge&logo=flathub&logoColor=white)](#download-url)
[![Linux Snapcraft Download](https://img.shields.io/static/v1?label=DOWNLOAD&message=Linux%20Snapcraft&color=0078D6&style=for-the-badge&logo=snapcraft)](#download-url) -->

</div>
<hr>
<div align="center">

[![Github All Contributors](https://img.shields.io/github/all-contributors/open-polito/open-polito?style=for-the-badge)](#contributors)
![GitHub all releases](https://img.shields.io/github/downloads/open-polito/open-polito/total?style=for-the-badge)
![GitHub repo size](https://img.shields.io/github/repo-size/open-polito/open-polito?style=for-the-badge)
![GitHub](https://img.shields.io/github/license/open-polito/open-polito?style=for-the-badge)

</div>

## Contents

- [Features](#features)
- [Running the app](#running-the-app)
- [Contributors](#contributors)
- [License](#license)

## Features

Open PoliTo's core features are currently being developed, but the app is already usable to some extent.

Check out the [Milestones](https://github.com/open-polito/open-polito/milestones) page to track the progress and features of the next release.

## Running the app

### Installing the binary

For the latest automated build APKs (updated on every push), see the [Actions](https://github.com/open-polito/open-polito/actions) tab.

For the latest stable releases and beta builds, please refer to the [Releases](https://github.com/open-polito/open-polito/releases) section.

### Building from source

#### 1. Setup

Make sure you have correctly installed and configured Node.  
Running on Android requires Android Studio and the Android SDK.  
Running on iOS requires XCode.

To run in the emulator (Android): setup an emulator in the AVD manager.  
To run on a real device (Android): connect the device to your development machine with USB debugging on.

More info on the environment setup is available at the [React Native website](https://reactnative.dev/docs/environment-setup) (under the "React Native CLI" section).

Install all dependencies: `yarn`

For iOS, install dependencies: `cd ios && pod install`

#### 2. Run in debug mode

Start Metro bundler: `yarn start`

Open a new terminal, from which you can:

- start the Android app: `yarn run android:debug`
- start the iOS app: `yarn run ios`

#### 3. Run in release mode

Alternatively, you can directly run the app in release mode:

- Android: `yarn run android:release` (replace `release` with `beta` or `dev` to run the beta or dev release, respectively).
- iOS: (coming soon).

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/robertolaru"><img src="https://avatars.githubusercontent.com/u/77898084?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Robert Olaru</b></sub></a><br /><a href="#maintenance-robertolaru" title="Maintenance">🚧</a> <a href="https://github.com/open-polito/open-polito/commits?author=robertolaru" title="Code">💻</a> <a href="#design-robertolaru" title="Design">🎨</a></td>
    <td align="center"><a href="https://keybase.io/CapacitorSet"><img src="https://avatars.githubusercontent.com/u/9286933?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Giulio Muscarello</b></sub></a><br /><a href="#infra-CapacitorSet" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/open-polito/open-polito/commits?author=CapacitorSet" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## License

Open PoliTo is licensed under the terms of the GNU General Public License v3.0.

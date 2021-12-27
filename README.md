<h1 align="center">Open PoliTo</h1>
<p align="center">Unofficial, open-source mobile app for Politecnico di Torino students.</p>

<div align="center">

[![Github All Contributors](https://img.shields.io/github/all-contributors/open-polito/open-polito)](#contributors)
![GitHub](https://img.shields.io/github/license/open-polito/open-polito?style=flat)
![GitHub repo size](https://img.shields.io/github/repo-size/open-polito/open-polito?style=flat)

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

For the latest stable release, please refer to the [Releases](https://github.com/open-polito/open-polito/releases) section.

### Building from source

Make sure you have correctly installed and configured Node, Android Studio and the Android SDK.

To run in the emulator: setup an emulator in the AVD manager.

To run on a real device: connect the device to your development machine with USB debugging on.

More info on the environment setup is available at the [React Native website](https://reactnative.dev/docs/environment-setup) (under the "React Native CLI" section).

Install all dependencies: `npm install`

Start Metro bundler: `npx react-native start`

Open a new terminal. From this new terminal start the Android app: `npx react-native run-android`

Open a new terminal. From this new terminal start the iOS app:  `cd ios` `pod install` `npx react-native run-ios`

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/robertolaru"><img src="https://avatars.githubusercontent.com/u/77898084?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Robert Olaru</b></sub></a><br /><a href="#maintenance-robertolaru" title="Maintenance">🚧</a> <a href="https://github.com/open-polito/open-polito/commits?author=robertolaru" title="Code">💻</a> <a href="#design-robertolaru" title="Design">🎨</a></td>
    <td align="center"><a href="https://keybase.io/CapacitorSet"><img src="https://avatars.githubusercontent.com/u/9286933?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Giulio Muscarello</b></sub></a><br /><a href="#infra-CapacitorSet" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## License

Open PoliTo is licensed under the terms of the GNU General Public License v3.0.

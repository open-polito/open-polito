fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

### bump

```sh
[bundle exec] fastlane bump
```

[For new binary versions]. Increase binary version name and code (without hash).
Pass tag:tagname as argument (e.g. tag:0.5.0).

### version_hash

```sh
[bundle exec] fastlane version_hash
```

Update version name (+ commit hash).
Pass tag:tagname as argument (e.g. tag:0.5.0).

### version

```sh
[bundle exec] fastlane version
```

Update version name (without hash).
Pass tag:tagname as argument (e.g. tag:0.5.0).

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).

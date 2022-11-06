import os
import sys
import json
import hashlib
import re

PLATFORMS = ["android", "linux", "windows", "macos"]


def create_asset_entry(os: str, arch: str, name: str, sha256: str) -> dict:
    res = {
        "os": os,
        "arch": arch,
        "name": name,
        "sha256": sha256
    }
    return res


def get_checksum(path: str) -> None:
    block_size = 2 ** 16
    sha256 = hashlib.sha256()
    with open(path, "rb") as f:
        while True:
            buffer = f.read(block_size)
            if not buffer:
                break
            sha256.update(buffer)
    return sha256.hexdigest()


if __name__ == "__main__":
    """Creates assets.json
    First argument: platform
    Second argument: git tag
    If the first argument is "final", it creates the final assets.json by merging the partial ones.
    If the first argument is anything else, it will do specific processing for that platform,
    and generate a partial assets json.
    """

    if len(sys.argv) != 3:
        raise Exception(
            "No platform argument provided and/or no git tag provided!\n")
    arg = sys.argv[1]
    git_tag = sys.argv[2]
    final_data = []
    if arg == "final":
        for platform in PLATFORMS:
            identifier = f"assets_{platform}.json"
            # actions/download-artifact@v3 creates a directory with file's name
            # for each downloaded artifact.
            # E.g. artifact my_file.json will be downloaded to my_file.json/my_file.json
            path = os.path.join(identifier, identifier)
            with open(path, "rt") as f:
                data = json.load(f)
                final_data.extend(data)
    elif arg == "android":
        apk_dir = "android/app/build/outputs/apk/releaseFlavor/release"
        files = os.listdir(apk_dir)
        metadata = dict()
        with open(os.path.join(apk_dir, "output-metadata.json"), "rt") as f:
            metadata = json.load(f)
        for element in metadata.get("elements"):
            arch = ""
            filename = element.get("outputFile")
            if len(element.get("filters")) > 0:
                arch = element.get("filters")[0].get("value")
            sha256 = get_checksum(os.path.join(apk_dir, filename))
            final_data.append(create_asset_entry(
                "android", arch, filename, sha256))
    else:
        pattern = re.compile(
            r"(?:_([a-z0-9]+))?(?:_en-US)?\.(deb|AppImage|dmg|app\.tar\.gz|msi)")
        subpaths = []
        base = "src-tauri/target/release/bundle"
        new_base = "tauri-out-app"
        if arg == "linux":
            subpaths = ["deb", "appimage"]
        elif arg == "windows":
            subpaths = ["msi"]
        elif arg == "macos":
            subpaths = ["dmg", "macos"]

        for dir in subpaths:
            for file in os.listdir(os.path.join(base, dir)):
                res = re.search(pattern, file)
                if res is not None:
                    arch = res.group(1)
                    ext = res.group(2)
                    new_filename = f"open-polito_{arg}_{git_tag}_{arch}.{ext}"
                    sha256 = get_checksum(os.path.join(base, dir, file))
                    final_data.append(create_asset_entry(
                        "linux", arch, new_filename, sha256))
                    os.renames(os.path.join(base, dir, file),
                               os.path.join(new_base, new_filename))

    assets_filename_suffix = ""
    if arg != "final":
        assets_filename_suffix = f"_{arg}"
    with open(f"assets{assets_filename_suffix}.json", "w+") as f:
        json.dump(final_data, f)

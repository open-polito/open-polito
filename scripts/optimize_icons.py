import json
import os
from common import log

TAG = "optimize_icons"

SELECTION_PATH = "assets/fonts/selection.json"
TXT_PATH = "assets/tabler-selected.txt"
FINAL_PATH = "assets/fonts/selection-final.json"
WEB_ICONS_TS_PATH = "src/utils/webIcons.ts"

def optimize_icons() -> None:
    """Optimize the icons json file, then generate the imports.
    react-native-vector-icons only needs, for each icon,
    the "name" and "code" properties inside "properties"
    """
    log(TAG, "Optimizing icons to reduce bundle size...")
    selection_full = {}
    selection_txt = set()
    with open(SELECTION_PATH, "rt") as f:
        selection_full = json.load(f)
    with open(TXT_PATH, "rt") as f:
        selection_txt = sorted(list(set([x.strip() for x in f.readlines()])))

    final_icons = [x for x in selection_full["icons"]
                   if x["properties"]["name"] in selection_txt]

    final_out = {"icons": []}

    for icon in final_icons:
        final_out["icons"].append({
            "properties": {
                "name": icon["properties"]["name"],
                "code": icon["properties"]["code"]
            }
        })

    with open(FINAL_PATH, "w+") as f:
        json.dump(final_out, f)

    with open(TXT_PATH, "w+") as f:
        f.write("\n".join(selection_txt))

    with open(WEB_ICONS_TS_PATH, "w+") as f:
        imports = []
        for x in selection_txt:
            imports.append("Icon" + "".join([part.capitalize()
                           for part in x.split("-")]))
        imports.append("TablerIcon")
        f.write(
            f"import {{{', '.join(imports)}}} from \"@tabler/icons\";\n\n")

        f.write("const webIcons: {[key: string]: TablerIcon} = { ")

        f.write(", ".join([f"\"{x}\": {imports[i]}"
                for i, x in enumerate(selection_txt)]))

        f.write(" }\n\n")
        f.write("export default webIcons;")
    os.system(f"yarn prettier --write {WEB_ICONS_TS_PATH}")
    log(TAG, "Icons optimized!")


if __name__ == "__main__":
    optimize_icons()

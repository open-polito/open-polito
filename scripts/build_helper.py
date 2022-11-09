import os
import sys
from optimize_icons import optimize_icons
from common import log

TAG = "build_helper"

WEBPACK_CFG_PATH = os.path.join(os.getcwd(), "webpack.config.js")
WEBPACK_CFG_RENAMED_PATH = os.path.join(
    os.getcwd(), "webpack.config.js.disabled")

ANALYZE_BUNDLE = os.environ.get("ANALYZE_BUNDLE")

if __name__ == "__main__":
    """Perform some actions before/after bundling.
    """
    if len(sys.argv) != 2:
        raise Exception("Provide an argument!")
    mode = sys.argv[1]
    log(TAG, f"Running build helper script in '{mode}' mode...")
    if (mode == "pre"):
        """Run pre-build stuff"""
        optimize_icons()
        if ANALYZE_BUNDLE != "1":
            # Disable webpack config, otherwise bundle doesn't work
            log(TAG, "Disabling Webpack config")
            os.rename(WEBPACK_CFG_PATH, WEBPACK_CFG_RENAMED_PATH)
    elif (mode == "post"):
        """Run post-build stuff"""
        if ANALYZE_BUNDLE != "1":
            # Re-enable webpack config
            log(TAG, "Re-enabling Webpack config")
            os.rename(WEBPACK_CFG_RENAMED_PATH, WEBPACK_CFG_PATH)

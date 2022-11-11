import os
import sys
from optimize_icons import optimize_icons
from common import log

TAG = "build_helper"

WEBPACK_CFG_PATH = os.path.join(os.getcwd(), "webpack.config.js")
WEBPACK_CFG_RENAMED_PATH = os.path.join(
    os.getcwd(), "webpack.config.js.disabled")

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
    elif (mode == "post"):
        """Run post-build stuff"""
        pass

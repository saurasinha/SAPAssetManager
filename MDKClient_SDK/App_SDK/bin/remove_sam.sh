#! /bin/bash
GREEN="\033[0;32m"
RED="\033[0;31m"
NC="\033[0m"
# Echo in green/red
function green {
  echo -e "${GREEN}${@}${NC}"
}
function red {
  echo -e "${RED}${@}${NC}"
}
function fail {
  red $@
  exit 1
}
# Get absolute path of this script
scriptDir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$scriptDir/.."
echo "Removing SAM plugins"
tns plugin remove extension-Analytics
tns plugin remove extension-BarcodeScanner
tns plugin remove extension-MapFramework
echo "Removing SAM externals"
npm uninstall --save dateformat
npm uninstall --save fs-extra
echo "Removing copy of SAM plugin directory"
rm -rf plugins/extension-Analytics
rm -rf plugins/extension-BarcodeScanner
rm -rf plugins/extension-MapFramework
echo "Deleting SAM extensions"
rm -rf app/extensions
echo "Deleting BrandedSettings.json"
rm -f app/branding/BrandedSettings.json
echo "Deleting bundle.js"
rm -f app/bundle.js
rm -f app/demo.js
echo "Deleting demo DBs"
rm -f app/branding/DEST_SAM20_PPROP.udb
rm -f app/branding/DEST_SAM20_PPROP.rq.udb
git checkout -- app/branding/DEST_SAM20_PPROP.udb
git checkout -- app/branding/DEST_SAM20_PPROP.rq.udb
echo "Deleting images added to app/App_Resources/iOS"
git clean -fdq app/App_Resources/iOS
git checkout -- app/App_Resources/iOS/menuIcon*.png
git checkout -- app/App_Resources/iOS/Assets.xcassets/AppIcon.appiconset/Contents.json
green "Done"

#!/bin/bash
set -e -o pipefail
GREEN='\033[0;32m'
NC='\033[0m'

dir="$(dirname "$0")"
"$dir/remove_broken_mdk_core.sh"

# Add the plugin into node-modules and updates package.json
echo "Compiling plugin TypeScript code"
cd "$(dirname "$0")/.."
npm run compile-plugins -- --debug
echo "Adding mdk-sap, toolbar and zip"
tns plugin add ./plugins/SAP
tns plugin add ./plugins/toolbar-plugin
tns plugin add ./plugins/zip-plugin
echo -e "${GREEN}Done${NC}"

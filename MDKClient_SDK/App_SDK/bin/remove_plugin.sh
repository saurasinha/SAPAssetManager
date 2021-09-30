#!/bin/bash
GREEN='\033[0;32m'
NC='\033[0m'

dir="$(dirname "$0")"
"$dir/remove_broken_mdk_core.sh"

echo -e "${GREEN}Removing mdk-sap plugin, toolbar-plugin and zip-plugin${NC}"
# Clears the plugin from node-modules and package.json
tns plugin remove mdk-sap
tns plugin remove toolbar-plugin
tns plugin remove zip-plugin
# Remove frameworks added by the plugin
echo -e "${GREEN}Removing Framworks created by mdk-sap${NC}"
shopt -s extglob
echo -e "${GREEN}Removing all frameworks from lib/iOS except TNSWidgets${NC}"
rm -r lib/iOS/!(TNSWidgets.framework)
echo -e "${GREEN}Done${NC}"

#!/bin/bash
GREEN='\033[0;32m'
NC='\033[0m'

dir="$(dirname "$0")"
cd "$dir/.."

mdk_core_folder=./node_modules/mdk-core
mdk_core_folder2=./modules/mdk-core
if [ -L "${mdk_core_folder}" ] ; then
  if [ ! -e "${mdk_core_folder}" ]; then
    echo -e "${GREEN}mdk-core is broken, remove it${NC}"
    rm -f "$mdk_core_folder"
    rm -f "$mdk_core_folder2"
    npm uninstall mdk-core --save
  fi
fi

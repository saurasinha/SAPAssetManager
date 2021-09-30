#!/bin/bash

realpath() {
  [[ $1 = /* ]] && echo "$1" || echo "$PWD/${1#./}"
}

cd "$(dirname "$0")/.."

if [ ! -z "$1" ]; then
  npm run compile-plugins-declaration -- --out "../../mdk-core/modules"
  npm run compile-plugins -- --debug
fi

pushd "../../mdk-core"
npm run build -- --debug --out "../gen/out/mdk-core-dist"

popd
mdk_core_folder=./node_modules/mdk-core
mdk_core_folder2=./modules/mdk-core

add_mdk_core=false
if [ -L "${mdk_core_folder}" ] ; then
  if [ ! -e "${mdk_core_folder}" ]; then
    echo -e "mdk-core is broken, remove it"
    rm -f "$mdk_core_folder"
    rm -f "$mdk_core_folder2"
    npm uninstall mdk-core --save

    add_mdk_core=true
  fi
else
  add_mdk_core=true
fi

if [ "$add_mdk_core" = "true" ]; then
  echo -e "add mdk-core back"
  mdk_core_dist_path=$(realpath "../../gen/out/mdk-core-dist")
  ln -s "$mdk_core_dist_path" "$mdk_core_folder2"
  mdk_core_folder2_path=$(realpath $mdk_core_folder2)
  npm install "$mdk_core_folder2_path" --save
fi

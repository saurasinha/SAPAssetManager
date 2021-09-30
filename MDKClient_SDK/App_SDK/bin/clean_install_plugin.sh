#!/bin/bash

dir="$(dirname "$0")"
"$dir/remove_plugin.sh"
#rm -rf platforms
tns platform remove ios
tns platform add ios@6.5.2
"$dir/install_plugin.sh"
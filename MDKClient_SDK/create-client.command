#!/bin/bash
# Command for invoking create-client.
# Must first be copied to the root of the SDK.
export LANG=en_US.UTF-8
# Get absolute path of this script
scriptDir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
node "$scriptDir/tools/create-client/create-client.js" "$@"

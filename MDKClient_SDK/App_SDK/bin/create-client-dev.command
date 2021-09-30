#!/bin/bash
# Command for invoking create-client-dev.
# Can be used to "install" any app's mdkproject into the dev environment.
export LANG=en_US.UTF-8
# Get absolute path of this script
scriptDir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$scriptDir"/..
node ../../tools/create-client/create-client-dev.js "$@"


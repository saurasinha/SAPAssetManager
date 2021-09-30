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
frameworkPath="$scriptDir"/libs/ios/MDCFramework/SAPMDC;
if [ ! -d "$frameworkPath" ]; then
  echo "Unzipping $frameworkPath.zip"
  mkdir "$frameworkPath"
  unzip -q "$frameworkPath.zip" -d "$frameworkPath" || "Failed to unzip SAPMDC"
fi
androidFrameworkPath="$scriptDir"/libs/android/MDKClient/MDKClient;
if [ ! -d "$androidFrameworkPath" ]; then
  echo "Unzipping $androidFrameworkPath.zip"
  mkdir "$androidFrameworkPath"
  unzip -q "$androidFrameworkPath.zip" -d "$androidFrameworkPath" || "Failed to unzip MDKClient"
fi
# Install the tool dependencies
pushd "$scriptDir"/tools > /dev/null
echo "Installing NPM dependencies."
echo 'Note: If this script appears stuck, check your NPM proxy configuration in Terminal with "npm config get proxy" and "npm config get https-proxy". Use the NPM config commands in the README to configure these settings.'
npm install || fail "Failed to install NPM dependencies."
popd > /dev/null
mv "$scriptDir"/tools/create-client/create-client.command "$scriptDir"
chmod +x "$scriptDir"/create-client.command
green "Successfully installed dependencies."
echo "To create a mobile development kit client, first make sure you have a .mdkproject with correctly configured MDKProject.json and BrandedSettings.json files. Then run create-client.command."

@setlocal
@echo off

cd /d "%~dp0"

set scriptDir=%~dp0
set frameworkPath=%scriptDir%\libs\ios\MDCFramework\SAPMDC
if not exist "%frameworkPath%" (
	echo Unzipping %frameworkPath%.zip
	mkdir "%frameworkPath%"
	powershell.exe -NoP -NonI -Command "Expand-Archive '%frameworkPath%.zip' '%frameworkPath%'"
)

set androidFrameworkPath=%scriptDir%\libs\android\MDKClient\MDKClient
if not exist "%androidFrameworkPath%" (
	echo Unzipping %androidFrameworkPath%.zip
	mkdir "%androidFrameworkPath%"
	powershell.exe -NoP -NonI -Command "Expand-Archive '%androidFrameworkPath%.zip' '%androidFrameworkPath%'"
)

cd tools
echo Installing NPM dependencies.
echo Note: If this script appears stuck, check your NPM proxy configuration in Terminal with "npm config get proxy" and "npm config get https-proxy". Use the NPM config commands in the README to configure these settings.
call npm install
@if errorlevel 1 (
	echo.
	echo Failed to install NPM dependencies.
)

cd ..
if exist "%scriptDir%\tools\create-client\create-client.cmd" (
	move /y "%scriptDir%\tools\create-client\create-client.cmd" "%scriptDir%"
)

echo.
echo Successfully installed dependencies.
echo To create a mobile development kit client, first make sure you have a .mdkproject with correctly configured MDKProject.json and BrandedSettings.json files. Then run create-client.cmd.

@endlocal

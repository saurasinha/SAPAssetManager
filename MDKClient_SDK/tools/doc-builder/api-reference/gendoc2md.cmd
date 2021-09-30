@setlocal
@echo off

cd %~dp0
./node_modules/.bin/typedoc --options ./typedocconfig_md.ts >nul 2>&1

@endlocal

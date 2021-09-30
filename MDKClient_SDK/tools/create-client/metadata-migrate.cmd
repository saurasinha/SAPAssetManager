@setlocal
@echo off

@cd /d "%~dp0"
node "metadata-migrate.js" %*

@endlocal

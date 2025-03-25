@echo off
echo Running Phoenix Roleplay diagnostic tool...
REM Change to the project root directory, not the scripts directory
cd "%~dp0\.."
node scripts/diagnose-build.js
pause

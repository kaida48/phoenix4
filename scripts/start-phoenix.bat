@echo off
echo Starting Phoenix Roleplay...
cd "%~dp0\phoenix-roleplay"
start cmd /k "npm run dev"
start http://localhost:3000
